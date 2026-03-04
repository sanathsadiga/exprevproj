import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
});

try {
  await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'expense_revenue_db'}`);
  console.log('Database created successfully');

  await connection.query(`USE ${process.env.DB_NAME || 'expense_revenue_db'}`);

  const createTablesSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'user') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS locations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS expense_revenue (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      location_id INT NOT NULL,
      month INT NOT NULL,
      year INT NOT NULL,
      expense DECIMAL(12, 2) DEFAULT 0,
      revenue DECIMAL(12, 2) DEFAULT 0,
      fiscal_year VARCHAR(10),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY unique_entry (user_id, location_id, month, year),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
      INDEX idx_fiscal_year (fiscal_year),
      INDEX idx_month_year (month, year),
      INDEX idx_location (location_id)
    );
  `;

  const statements = createTablesSQL.split(';').filter((stmt) => stmt.trim());

  for (const statement of statements) {
    if (statement.trim()) {
      await connection.query(statement);
    }
  }

  console.log('Tables created successfully');

  const adminCheckQuery = 'SELECT COUNT(*) as count FROM users WHERE role = "admin"';
  const [adminCheck] = await connection.query(adminCheckQuery);

  if (adminCheck[0].count === 0) {
    const adminPassword = await hashPassword('admin123');
    await connection.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Admin User', 'admin@example.com', adminPassword, 'admin']
    );
    console.log('Default admin user created');
  }

  const locationCheckQuery = 'SELECT COUNT(*) as count FROM locations';
  const [locationCheck] = await connection.query(locationCheckQuery);

  if (locationCheck[0].count === 0) {
    const defaultLocations = [
      'TUMKUR',
      'CHIKKA BALLAPUR',
      'KOLAR',
      'RAMANAGAR',
      'DODDABALLAPUR',
      'PUTTUR',
      'KUNDAPUR',
      'HAVERI',
      'GADAG',
      'DHARWAD',
      'CHITRADURGA',
      'MANDYA',
      'MADIKERI',
      'CHAMRAJNAGAR',
      'HOSPET',
      'KOPPAL',
      'RAICHUR',
      'CHIKMAGALORE',
      'BIDAR',
      'CHIKKODI',
      'HASSAN',
      'BAGALKOT',
    ];

    for (const location of defaultLocations) {
      await connection.query(
        'INSERT INTO locations (name) VALUES (?)',
        [location]
      );
    }
    console.log('Default locations created');
  }

  console.log('Database initialization completed successfully');
} catch (error) {
  console.error('Error initializing database:', error.message);
} finally {
  await connection.end();
  process.exit(0);
}

async function hashPassword(password) {
  const bcrypt = await import('bcryptjs');
  const salt = await bcrypt.default.genSalt(10);
  return bcrypt.default.hash(password, salt);
}
