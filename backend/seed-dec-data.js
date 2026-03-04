import pool from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const decData = [
  { location: 'TUMKUR', expense: 13606, revenue: 15000 },
  { location: 'CHIKKA BALLAPUR', expense: 13200, revenue: 0 },
  { location: 'KOLAR', expense: 10445, revenue: 0 },
  { location: 'RAMANAGAR', expense: 11950, revenue: 40000 },
  { location: 'DODDABALLAPUR', expense: 11850, revenue: 0 },
  { location: 'PUTTUR', expense: 6180, revenue: 0 },
  { location: 'KUNDAPUR', expense: 10900, revenue: 0 },
  { location: 'HAVERI', expense: 11800, revenue: 50000 },
  { location: 'GADAG', expense: 13760, revenue: 0 },
  { location: 'DHARWAD', expense: 13790, revenue: 0 },
  { location: 'CHITRADURGA', expense: 8920, revenue: 0 },
  { location: 'MANDYA', expense: 13423, revenue: 191000 },
  { location: 'MADIKERI', expense: 12000, revenue: 20000 },
  { location: 'CHAMRAJNAGAR', expense: 10544, revenue: 0 },
  { location: 'HOSPET', expense: 8531, revenue: 100000 },
  { location: 'KOPPAL', expense: 9788, revenue: 0 },
  { location: 'RAICHUR', expense: 12495, revenue: 20000 },
  { location: 'CHIKMAGALORE', expense: 12769, revenue: 0 },
  { location: 'BIDAR', expense: 9888, revenue: 0 },
  { location: 'CHIKKODI', expense: 11580, revenue: 0 },
  { location: 'HASSAN', expense: 13591, revenue: 0 },
  { location: 'BAGALKOT', expense: 0, revenue: 0 },
];

async function seedDecemberData() {
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

    for (const data of decData) {
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
          [adminId, locationId, 9, 2025, data.expense, data.revenue, '2024-2025', data.expense, data.revenue]
        );
        insertedCount++;
      } catch (error) {
        console.error(`Error inserting data for ${data.location}:`, error.message);
      }
    }

    connection.release();
    console.log(`\nDecember 2025 data seeded successfully!`);
    console.log(`Inserted/Updated: ${insertedCount} records`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
}

seedDecemberData();
