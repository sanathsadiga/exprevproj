import pool from './config/database.js';

const fixFiscalYears = async () => {
  try {
    const connection = await pool.getConnection();

    // Get all records
    const [records] = await connection.query('SELECT id, month, year, fiscal_year FROM expense_revenue');

    console.log(`Found ${records.length} records to process`);

    for (const record of records) {
      // month is fiscal month (1=April, 2=May, 3=June...10=January, 11=February, 12=March)
      // year is the calendar year of the data
      // We need to determine the correct fiscal year based on month and year
      
      let correctFiscalYear;
      
      if (record.month >= 1 && record.month <= 9) {
        // April-December (months 1-9) belong to fiscal year starting in same calendar year
        correctFiscalYear = `${record.year}-${record.year + 1}`;
      } else if (record.month >= 10 && record.month <= 12) {
        // January-March (months 10-12) belong to fiscal year starting in PREVIOUS calendar year
        correctFiscalYear = `${record.year - 1}-${record.year}`;
      }

      // Update if different
      if (record.fiscal_year !== correctFiscalYear) {
        await connection.query(
          'UPDATE expense_revenue SET fiscal_year = ? WHERE id = ?',
          [correctFiscalYear, record.id]
        );
        console.log(`Record ${record.id}: month=${record.month}, year=${record.year}, fiscal_year ${record.fiscal_year} -> ${correctFiscalYear}`);
      }
    }

    connection.release();
    console.log('Fiscal year fix completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing fiscal years:', error);
    process.exit(1);
  }
};

fixFiscalYears();
