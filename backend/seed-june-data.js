import pool from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const juneData = [
  { location: 'TUMKUR', expense: 14900, revenue: 52000 },
  { location: 'CHIKKA BALLAPUR', expense: 12604, revenue: 0 },
  { location: 'KOLAR', expense: 10115, revenue: 0 },
  { location: 'RAMANAGAR', expense: 12530, revenue: 0 },
  { location: 'DODDABALLAPUR', expense: 11074, revenue: 0 },
  { location: 'PUTTUR', expense: 5500, revenue: 75000 },
  { location: 'KUNDAPUR', expense: 11120, revenue: 55000 },
  { location: 'HAVERI', expense: 11582, revenue: 90000 },
  { location: 'GADAG', expense: 12955, revenue: 0 },
  { location: 'DHARWAD', expense: 14264, revenue: 0 },
  { location: 'CHITRADURGA', expense: 9960, revenue: 0 },
  { location: 'MANDYA', expense: 13423, revenue: 20000 },
  { location: 'MADIKERI', expense: 11750, revenue: 0 },
  { location: 'CHAMRAJNAGAR', expense: 9740, revenue: 10000 },
  { location: 'HOSPET', expense: 8907, revenue: 25000 },
  { location: 'KOPPAL', expense: 9288, revenue: 105000 },
  { location: 'RAICHUR', expense: 11350, revenue: 125000 },
  { location: 'CHIKMAGALORE', expense: 12981, revenue: 60000 },
  { location: 'BIDAR', expense: 9613, revenue: 0 },
  { location: 'CHIKKODI', expense: 11964, revenue: 46750 },
  { location: 'HASSAN', expense: 12148, revenue: 35000 },
  { location: 'BAGALKOT', expense: 0, revenue: 204500 },
];

async function seedJuneData() {
  try {
    const connection = await pool.getConnection();

    // Get admin user ID
    const [adminUser] = await connection.query('SELECT id FROM users WHERE role = "admin" LIMIT 1');
    const adminId = adminUser[0]?.id;

    if (!adminId) {
      console.error('Admin user not found');
      connection.release();
      process.exit(1);
    }

    let insertedCount = 0;

    for (const data of juneData) {
      // Get location ID
      const [location] = await connection.query('SELECT id FROM locations WHERE name = ?', [data.location]);

      if (location.length === 0) {
        console.warn(`Location not found: ${data.location}`);
        continue;
      }

      const locationId = location[0].id;

      // Insert data for April 2025 (month = 1 in fiscal year, year = 2025)
      try {
        await connection.query(
          `INSERT INTO expense_revenue (user_id, location_id, month, year, expense, revenue, fiscal_year, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
           ON DUPLICATE KEY UPDATE expense = ?, revenue = ?`,
          [adminId, locationId, 3, 2025, data.expense, data.revenue, '2024-2025', data.expense, data.revenue]
        );
        insertedCount++;
      } catch (error) {
        console.error(`Error inserting data for ${data.location}:`, error.message);
      }
    }

    connection.release();
    console.log(`\nJune 2025 data seeded successfully!`);
    console.log(`Inserted/Updated: ${insertedCount} records`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
}

seedJuneData();
