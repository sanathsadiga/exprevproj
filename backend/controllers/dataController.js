import pool from '../config/database.js';
import { generateFiscalYear } from '../utils/helpers.js';

export const addExpenseRevenue = async (req, res) => {
  try {
    const { location_id, month, year, expense, revenue } = req.body;
    const userId = req.user.id;

    if (!location_id || !month || !year || expense === undefined || revenue === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const connection = await pool.getConnection();

    const [existingRecord] = await connection.query(
      'SELECT id FROM expense_revenue WHERE user_id = ? AND location_id = ? AND month = ? AND year = ?',
      [userId, location_id, month, year]
    );

    if (existingRecord.length > 0) {
      await connection.query(
        'UPDATE expense_revenue SET expense = ?, revenue = ?, updated_at = NOW() WHERE user_id = ? AND location_id = ? AND month = ? AND year = ?',
        [expense, revenue, userId, location_id, month, year]
      );
    } else {
      await connection.query(
        'INSERT INTO expense_revenue (user_id, location_id, month, year, expense, revenue, fiscal_year, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
        [userId, location_id, month, year, expense, revenue, generateFiscalYear(new Date(year, month - 1))]
      );
    }

    connection.release();

    res.json({ message: 'Expense and revenue data saved successfully' });
  } catch (error) {
    console.error('Add expense/revenue error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMonthlyData = async (req, res) => {
  try {
    const { month, year, location_id } = req.query;
    const userId = req.user.id;

    let query = 'SELECT * FROM expense_revenue WHERE user_id = ?';
    const params = [userId];

    if (location_id) {
      query += ' AND location_id = ?';
      params.push(location_id);
    }

    if (month) {
      query += ' AND month = ?';
      params.push(month);
    }

    if (year) {
      query += ' AND year = ?';
      params.push(year);
    }

    const connection = await pool.getConnection();
    const [data] = await connection.query(query, params);
    connection.release();

    res.json({ data });
  } catch (error) {
    console.error('Get monthly data error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getYearlyData = async (req, res) => {
  try {
    const { fiscal_year } = req.query;
    const userId = req.user.id;

    let query = `
      SELECT 
        location_id,
        fiscal_year,
        SUM(expense) as total_expense,
        SUM(revenue) as total_revenue,
        COUNT(*) as month_count
      FROM expense_revenue
      WHERE user_id = ?
    `;
    const params = [userId];

    if (fiscal_year) {
      query += ' AND fiscal_year = ?';
      params.push(fiscal_year);
    }

    query += ' GROUP BY location_id, fiscal_year';

    const connection = await pool.getConnection();
    const [data] = await connection.query(query, params);
    connection.release();

    res.json({ data });
  } catch (error) {
    console.error('Get yearly data error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllMonthlyData = async (req, res) => {
  try {
    const { month, year, location_id } = req.query;

    let query = `
      SELECT 
        er.id,
        er.user_id,
        u.name as user_name,
        er.location_id,
        l.name as location_name,
        er.month,
        er.year,
        er.expense,
        er.revenue,
        er.fiscal_year,
        er.created_at,
        er.updated_at
      FROM expense_revenue er
      JOIN users u ON er.user_id = u.id
      JOIN locations l ON er.location_id = l.id
    `;
    const params = [];

    if (location_id) {
      query += ' WHERE er.location_id = ?';
      params.push(location_id);
    }

    if (month) {
      query += params.length > 0 ? ' AND' : ' WHERE';
      query += ' er.month = ?';
      params.push(month);
    }

    if (year) {
      query += params.length > 0 ? ' AND' : ' WHERE';
      query += ' er.year = ?';
      params.push(year);
    }

    query += ' ORDER BY er.year DESC, er.month DESC';

    const connection = await pool.getConnection();
    const [data] = await connection.query(query, params);
    connection.release();

    res.json({ data });
  } catch (error) {
    console.error('Get all monthly data error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllYearlyData = async (req, res) => {
  try {
    const { fiscal_year, location_id } = req.query;

    let query = `
      SELECT 
        er.fiscal_year,
        er.location_id,
        l.name as location_name,
        SUM(er.expense) as total_expense,
        SUM(er.revenue) as total_revenue,
        COUNT(DISTINCT er.user_id) as user_count,
        COUNT(*) as record_count
      FROM expense_revenue er
      JOIN locations l ON er.location_id = l.id
    `;
    const params = [];

    if (fiscal_year) {
      query += ' WHERE er.fiscal_year = ?';
      params.push(fiscal_year);
    }

    if (location_id) {
      query += params.length > 0 ? ' AND' : ' WHERE';
      query += ' er.location_id = ?';
      params.push(location_id);
    }

    query += ' GROUP BY er.fiscal_year, er.location_id, l.name ORDER BY er.fiscal_year DESC';

    const connection = await pool.getConnection();
    const [data] = await connection.query(query, params);
    connection.release();

    res.json({ data });
  } catch (error) {
    console.error('Get all yearly data error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const connection = await pool.getConnection();

    let overallQuery = `
      SELECT 
        SUM(expense) as total_expense,
        SUM(revenue) as total_revenue,
        COUNT(*) as total_records
      FROM expense_revenue
    `;
    const overallParams = [];

    if (!isAdmin) {
      overallQuery += ' WHERE user_id = ?';
      overallParams.push(userId);
    }

    const [overall] = await connection.query(overallQuery, overallParams);

    const fiscalYearQuery = `
      SELECT DISTINCT fiscal_year FROM expense_revenue ${!isAdmin ? 'WHERE user_id = ?' : ''} ORDER BY fiscal_year DESC LIMIT 1
    `;

    const fiscalYearParams = !isAdmin ? [userId] : [];
    const [latestFiscalYear] = await connection.query(fiscalYearQuery, fiscalYearParams);
    const currentFiscalYear = latestFiscalYear[0]?.fiscal_year || generateFiscalYear();

    let currentYearQuery = `
      SELECT 
        SUM(expense) as total_expense,
        SUM(revenue) as total_revenue,
        COUNT(*) as total_records
      FROM expense_revenue
      WHERE fiscal_year = ?
    `;
    const currentYearParams = [currentFiscalYear];

    if (!isAdmin) {
      currentYearQuery += ' AND user_id = ?';
      currentYearParams.push(userId);
    }

    const [currentYear] = await connection.query(currentYearQuery, currentYearParams);

    let locationQuery = `
      SELECT 
        l.id,
        l.name,
        SUM(er.expense) as total_expense,
        SUM(er.revenue) as total_revenue
      FROM expense_revenue er
      JOIN locations l ON er.location_id = l.id
    `;
    const locationParams = [];

    if (!isAdmin) {
      locationQuery += ' WHERE er.user_id = ?';
      locationParams.push(userId);
    }

    locationQuery += ' GROUP BY l.id, l.name ORDER BY total_expense DESC';

    const [locationData] = await connection.query(locationQuery, locationParams);

    connection.release();

    res.json({
      overall: overall[0] || { total_expense: 0, total_revenue: 0, total_records: 0 },
      currentFiscalYear,
      currentYear: currentYear[0] || { total_expense: 0, total_revenue: 0, total_records: 0 },
      byLocation: locationData,
    });
  } catch (error) {
    console.error('Get dashboard summary error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteExpenseRevenue = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id) {
      return res.status(400).json({ message: 'ID is required' });
    }

    const connection = await pool.getConnection();

    const [record] = await connection.query(
      'SELECT id FROM expense_revenue WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (record.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Record not found or not authorized' });
    }

    await connection.query('DELETE FROM expense_revenue WHERE id = ?', [id]);
    connection.release();

    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateExpenseRevenue = async (req, res) => {
  try {
    const { id } = req.params;
    const { expense, revenue } = req.body;
    const userId = req.user.id;

    if (!id || expense === undefined || revenue === undefined) {
      return res.status(400).json({ message: 'ID and values are required' });
    }

    const connection = await pool.getConnection();

    const [record] = await connection.query(
      'SELECT id FROM expense_revenue WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (record.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Record not found or not authorized' });
    }

    await connection.query(
      'UPDATE expense_revenue SET expense = ?, revenue = ?, updated_at = NOW() WHERE id = ?',
      [expense, revenue, id]
    );

    connection.release();

    res.json({ message: 'Record updated successfully' });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const bulkImportCSV = async (req, res) => {
  try {
    const { month, year, data } = req.body;
    const userId = req.user.id;

    if (!month || !year || !data || !Array.isArray(data)) {
      return res.status(400).json({ message: 'month, year, and data array are required' });
    }

    if (data.length === 0) {
      return res.status(400).json({ message: 'Data array cannot be empty' });
    }

    const connection = await pool.getConnection();
    const fiscalYear = generateFiscalYear(new Date(year, month - 1));

    let insertedCount = 0;
    let skippedCount = 0;
    const errors = [];

    for (const row of data) {
      try {
        const { location, expense, revenue } = row;

        if (!location) {
          skippedCount++;
          errors.push(`Row skipped: location not provided`);
          continue;
        }

        const [locationResult] = await connection.query(
          'SELECT id FROM locations WHERE name = ?',
          [location.trim()]
        );

        if (locationResult.length === 0) {
          skippedCount++;
          errors.push(`Location not found: ${location}`);
          continue;
        }

        const locationId = locationResult[0].id;
        const expenseValue = parseFloat(expense) || 0;
        const revenueValue = parseFloat(revenue) || 0;

        await connection.query(
          `INSERT INTO expense_revenue (user_id, location_id, month, year, expense, revenue, fiscal_year, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
           ON DUPLICATE KEY UPDATE expense = ?, revenue = ?, updated_at = NOW()`,
          [userId, locationId, month, year, expenseValue, revenueValue, fiscalYear, expenseValue, revenueValue]
        );

        insertedCount++;
      } catch (error) {
        skippedCount++;
        errors.push(`Error processing row: ${error.message}`);
      }
    }

    connection.release();

    res.json({
      message: 'Bulk import completed',
      inserted: insertedCount,
      skipped: skippedCount,
      errors: errors.slice(0, 10), // Return first 10 errors
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
