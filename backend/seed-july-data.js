import pool from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const julyData = [
  { location: 'TUMKUR', expense: 14975, revenue: 0 },
  { location: 'CHIKKA BALLAPUR', expense: 13150, revenue: 283000 },
  { location: 'KOLAR', expense: 10115, revenue: 35000 },
  { location: 'RAMANAGAR', expense: 12530, revenue: 60000 },
  { location: 'DODDABALLAPUR', expense: 10950, revenue: 0 },
  { location: 'PUTTUR', expense: 6050, revenue: 400000 },
  { location: 'KUNDAPUR', expense: 11270, revenue: 52000 },
  { location: 'HAVERI', expense: 11535, revenue: 25000 },
  { location: 'GADAG', expense: 12955, revenue: 0 },
  { location: 'DHARWAD', expense: 13094, revenue: 0 },
  { location: 'CHITRADURGA', expense: 10870, revenue: 25000 },
  { location: 'MANDYA', expense: 13623, revenue: 0 },
  { location: 'MADIKERI', expense: 11900, revenue: 20000 },
  { location: 'CHAMRAJNAGAR', expense: 9714, revenue: 30000 },
  { location: 'HOSPET', expense: 9329, revenue: 0 },
  { location: 'KOPPAL', expense: 10113, revenue: 0 },
  { location: 'RAICHUR', expense: 11350, revenue: 0 },
  { location: 'CHIKMAGALORE', expense: 12500, revenue: 35000 },
  { location: 'BIDAR', expense: 9596, revenue: 0 },
  { location: 'CHIKKODI', expense: 12000, revenue: 93500 },
  { location: 'HASSAN', expense: 13018, revenue: 60000 },
  { location: 'BAGALKOT', expense: 0, revenue: 445000 },
];

async function seedJulyData() {
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

    for (const data of julyData) {
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
          [adminId, locationId, 4, 2025, data.expense, data.revenue, '2024-2025', data.expense, data.revenue]
        );
        insertedCount++;
      } catch (error) {
        console.error(`Error inserting data for ${data.location}:`, error.message);
      }
    }

    connection.release();
    console.log(`\nJuly 2025 data seeded successfully!`);
    console.log(`Inserted/Updated: ${insertedCount} records`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
}

seedJulyData();
