import pool from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const augustData = [
  { location: 'TUMKUR', expense: 14975, revenue: 0 },
  { location: 'CHIKKA BALLAPUR', expense: 13150, revenue: 0 },
  { location: 'KOLAR', expense: 10115, revenue: 150000 },
  { location: 'RAMANAGAR', expense: 12322, revenue: 0 },
  { location: 'DODDABALLAPUR', expense: 11100, revenue: 0 },
  { location: 'PUTTUR', expense: 6050, revenue: 0 },
  { location: 'KUNDAPUR', expense: 11000, revenue: 0 },
  { location: 'HAVERI', expense: 11535, revenue: 15000 },
  { location: 'GADAG', expense: 12955, revenue: 25000 },
  { location: 'DHARWAD', expense: 13094, revenue: 0 },
  { location: 'CHITRADURGA', expense: 10870, revenue: 0 },
  { location: 'MANDYA', expense: 13623, revenue: 20000 },
  { location: 'MADIKERI', expense: 10980, revenue: 0 },
  { location: 'CHAMRAJNAGAR', expense: 9840, revenue: 50000 },
  { location: 'HOSPET', expense: 9160, revenue: 60000 },
  { location: 'KOPPAL', expense: 10080, revenue: 0 },
  { location: 'RAICHUR', expense: 11120, revenue: 0 },
  { location: 'CHIKMAGALORE', expense: 12250, revenue: 0 },
  { location: 'BIDAR', expense: 9480, revenue: 0 },
  { location: 'CHIKKODI', expense: 11950, revenue: 0 },
  { location: 'HASSAN', expense: 12803, revenue: 20000 },
  { location: 'BAGALKOT', expense: 0, revenue: 0 },
];

async function seedAugustData() {
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

    for (const data of augustData) {
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
          [adminId, locationId, 5, 2025, data.expense, data.revenue, '2024-2025', data.expense, data.revenue]
        );
        insertedCount++;
      } catch (error) {
        console.error(`Error inserting data for ${data.location}:`, error.message);
      }
    }

    connection.release();
    console.log(`\nAugust 2025 data seeded successfully!`);
    console.log(`Inserted/Updated: ${insertedCount} records`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
}

seedAugustData();
