import pool from '../config/database.js';

export const createLocation = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Location name is required' });
    }

    const connection = await pool.getConnection();

    const [existingLocation] = await connection.query(
      'SELECT id FROM locations WHERE name = ?',
      [name]
    );

    if (existingLocation.length > 0) {
      connection.release();
      return res.status(400).json({ message: 'Location already exists' });
    }

    const [result] = await connection.query(
      'INSERT INTO locations (name, created_at) VALUES (?, NOW())',
      [name]
    );

    connection.release();

    res.status(201).json({
      message: 'Location created successfully',
      location: { id: result.insertId, name },
    });
  } catch (error) {
    console.error('Create location error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getLocations = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [locations] = await connection.query('SELECT id, name FROM locations ORDER BY name');
    connection.release();

    res.json({ locations });
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();

    const [existingLocation] = await connection.query(
      'SELECT id FROM locations WHERE id = ?',
      [id]
    );

    if (existingLocation.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Location not found' });
    }

    await connection.query('DELETE FROM locations WHERE id = ?', [id]);
    connection.release();

    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Delete location error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
