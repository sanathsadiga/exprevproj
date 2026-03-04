import pool from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const novData = [
  { location: 'TUMKUR', expense: 15159, revenue: 0 },
  { location: 'CHIKKA BALLAPUR', expense: 13360, revenue: 0 },
  { location: 'KOLAR', expense: 10445, revenue: 0 },
  { location: 'RAMANAGAR', expense: 11950, revenue: 0 },
  { location: 'DODDABALLAPUR', expense: 11658, revenue: 230000 },
  { location: 'PUTTUR', expense: 6180, revenue: 0 },
  { location: 'KUNDAPUR', expense: 11270, revenue: 0 },
  { location: 'HAVERI', expense: 11124, revenue: 0 },
  { location: 'GADAG', expense: 13004, revenue: 0 },
  { location: 'DHARWAD', expense: 13628, revenue: 0 },
  { location: 'CHITRADURGA', expense: 10024, revenue: 0 },
  { location: 'MANDYA', expense: 13523, revenue: 0 },
  { location: 'MADIKERI', expense: 11850, revenue: 0 },
  { location: 'CHAMRAJNAGAR', expense: 9746, revenue: 0 },
  { location: 'HOSPET', expense: 8592, revenue: 0 },
  { location: 'KOPPAL', expense: 9497, revenue: 0 },
  { location: 'RAICHUR', expense: 11542, revenue: 0 },
  { location: 'CHIKMAGALORE', expense: 13395, revenue: 0 },
  { location: 'BIDAR', expense: 9737, revenue: 0 },
  { location: 'CHIKKODI', expense: 11329, revenue: 0 },
  { location: 'HASSAN', expense: 13803, revenue: 0 },
  { location: 'BAGALKOT', expense: 0, revenue: 0 },
];

async function seedNovemberData() {
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

    for (const data of novData) {
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
          [adminId, locationId, 8, 2025, data.expense, data.revenue, '2024-2025', data.expense, data.revenue]
        );
        insertedCount++;
      } catch (error) {
        console.error(`Error inserting data for ${data.location}:`, error.message);
      }
    }

    connection.release();
    console.log(`\nNovember 2025 data seeded successfully!`);
    console.log(`Inserted/Updated: ${insertedCount} records`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
}

seedNovemberData();
