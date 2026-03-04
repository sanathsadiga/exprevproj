import pool from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const febData = [
  { location: 'TUMKUR', expense: 15670, revenue: 0 },
  { location: 'CHIKKA BALLAPUR', expense: 13071, revenue: 0 },
  { location: 'KOLAR', expense: 10295, revenue: 0 },
  { location: 'RAMANAGAR', expense: 12318, revenue: 20000 },
  { location: 'DODDABALLAPUR', expense: 11565, revenue: 0 },
  { location: 'PUTTUR', expense: 6000, revenue: 0 },
  { location: 'KUNDAPUR', expense: 11810, revenue: 0 },
  { location: 'HAVERI', expense: 11508, revenue: 100000 },
  { location: 'GADAG', expense: 13282, revenue: 0 },
  { location: 'DHARWAD', expense: 14383, revenue: 0 },
  { location: 'CHITRADURGA', expense: 10565, revenue: 0 },
  { location: 'MANDYA', expense: 14019, revenue: 0 },
  { location: 'MADIKERI', expense: 11850, revenue: 20000 },
  { location: 'CHAMRAJNAGAR', expense: 9786, revenue: 0 },
  { location: 'HOSPET', expense: 9679, revenue: 30000 },
  { location: 'KOPPAL', expense: 10454, revenue: 0 },
  { location: 'RAICHUR', expense: 13600, revenue: 0 },
  { location: 'CHIKMAGALORE', expense: 13333, revenue: 180000 },
  { location: 'BIDAR', expense: 9806, revenue: 0 },
  { location: 'CHIKKODI', expense: 12271, revenue: 0 },
  { location: 'HASSAN', expense: 13277, revenue: 0 },
  { location: 'BAGALKOT', expense: 0, revenue: 0 },
];

async function seedFebruaryData() {
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

    for (const data of febData) {
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
          [adminId, locationId, 11, 2026, data.expense, data.revenue, '2024-2025', data.expense, data.revenue]
        );
        insertedCount++;
      } catch (error) {
        console.error(`Error inserting data for ${data.location}:`, error.message);
      }
    }

    connection.release();
    console.log(`\nFebruary 2026 data seeded successfully!`);
    console.log(`Inserted/Updated: ${insertedCount} records`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
}

seedFebruaryData();
