import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'expense_revenue_db',
});

try {
  // Check if column exists first
  const [rows] = await connection.query(`
    SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'expense_revenue' 
    AND COLUMN_NAME = 'revenue_source'
  `);
  
  if (rows.length === 0) {
    // Column doesn't exist, add it
    await connection.query(`
      ALTER TABLE expense_revenue 
      ADD COLUMN revenue_source VARCHAR(500) DEFAULT NULL AFTER revenue
    `);
    console.log('Column revenue_source added successfully');
  } else {
    console.log('Column revenue_source already exists');
  }
  
  await connection.end();
} catch (error) {
  console.error('Error adding column:', error);
  process.exit(1);
}
