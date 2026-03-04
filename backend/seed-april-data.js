import pool from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const aprilData = [
  { location: 'TUMKUR', expense: 15180, revenue: 0 },
  { location: 'CHIKKA BALLAPUR', expense: 12800, revenue: 0 },
  { location: 'KOLAR', expense: 10115, revenue: 105000 },
  { location: 'RAMANAGAR', expense: 12450, revenue: 0 },
  { location: 'DODDABALLAPUR', expense: 11250, revenue: 0 },
  { location: 'PUTTUR', expense: 5500, revenue: 0 },
  { location: 'KUNDAPUR', expense: 11020, revenue: 0 },
  { location: 'HAVERI', expense: 11558, revenue: 0 },
  { location: 'GADAG', expense: 13061, revenue: 0 },
  { location: 'DHARWAD', expense: 13622, revenue: 0 },
  { location: 'CHITRADURGA', expense: 9960, revenue: 40000 },
  { location: 'MANDYA', expense: 13423, revenue: 0 },
  { location: 'MADIKERI', expense: 11750, revenue: 0 },
  { location: 'CHAMRAJNAGAR', expense: 9711, revenue: 30000 },
  { location: 'HOSPET', expense: 9107, revenue: 35000 },
  { location: 'KOPPAL', expense: 9128, revenue: 76000 },
  { location: 'RAICHUR', expense: 11350, revenue: 0 },
  { location: 'CHIKMAGALORE', expense: 12100, revenue: 190000 },
  { location: 'BIDAR', expense: 9796, revenue: 0 },
  { location: 'CHIKKODI', expense: 12074, revenue: 0 },
  { location: 'HASSAN', expense: 12592, revenue: 0 },
  { location: 'BAGALKOT', expense: 0, revenue: 0 },
];

async function seedAprilData() {
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

    for (const data of aprilData) {
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
          [adminId, locationId, 1, 2025, data.expense, data.revenue, '2024-2025', data.expense, data.revenue]
        );
        insertedCount++;
      } catch (error) {
        console.error(`Error inserting data for ${data.location}:`, error.message);
      }
    }

    connection.release();
    console.log(`\nApril 2025 data seeded successfully!`);
    console.log(`Inserted/Updated: ${insertedCount} records`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
}

seedAprilData();
