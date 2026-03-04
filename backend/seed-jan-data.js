import pool from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const janData = [
  { location: 'TUMKUR', expense: 15030, revenue: 15000 },
  { location: 'CHIKKA BALLAPUR', expense: 13080, revenue: 0 },
  { location: 'KOLAR', expense: 10295, revenue: 0 },
  { location: 'RAMANAGAR', expense: 12318, revenue: 30000 },
  { location: 'DODDABALLAPUR', expense: 11565, revenue: 0 },
  { location: 'PUTTUR', expense: 6000, revenue: 0 },
  { location: 'KUNDAPUR', expense: 11810, revenue: 0 },
  { location: 'HAVERI', expense: 11498, revenue: 0 },
  { location: 'GADAG', expense: 13150, revenue: 15000 },
  { location: 'DHARWAD', expense: 14401, revenue: 339000 },
  { location: 'CHITRADURGA', expense: 10203, revenue: 42000 },
  { location: 'MANDYA', expense: 14019, revenue: 0 },
  { location: 'MADIKERI', expense: 11850, revenue: 0 },
  { location: 'CHAMRAJNAGAR', expense: 9398, revenue: 0 },
  { location: 'HOSPET', expense: 9679, revenue: 0 },
  { location: 'KOPPAL', expense: 10154, revenue: 0 },
  { location: 'RAICHUR', expense: 13600, revenue: 35000 },
  { location: 'CHIKMAGALORE', expense: 13395, revenue: 0 },
  { location: 'BIDAR', expense: 9838, revenue: 0 },
  { location: 'CHIKKODI', expense: 12192, revenue: 0 },
  { location: 'HASSAN', expense: 13172, revenue: 35000 },
  { location: 'BAGALKOT', expense: 0, revenue: 0 },
];

async function seedJanuaryData() {
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

    for (const data of janData) {
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
          [adminId, locationId, 10, 2026, data.expense, data.revenue, '2024-2025', data.expense, data.revenue]
        );
        insertedCount++;
      } catch (error) {
        console.error(`Error inserting data for ${data.location}:`, error.message);
      }
    }

    connection.release();
    console.log(`\nJanuary 2026 data seeded successfully!`);
    console.log(`Inserted/Updated: ${insertedCount} records`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
}

seedJanuaryData();
