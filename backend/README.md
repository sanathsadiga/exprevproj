# Expense and Revenue Dashboard Backend

Express.js backend for the Expense and Revenue Management Dashboard with MySQL database integration.

## Features

- User authentication with JWT tokens
- Role-based access control (Admin/User)
- Expense and revenue data management
- Monthly and yearly data aggregation
- Location-based filtering
- Fiscal year calculations (April-March)
- Dashboard summary statistics
- Secure password hashing with bcryptjs
- Input validation and error handling

## Setup Instructions

### Prerequisites

- Node.js v14 or higher
- MySQL Server v5.7 or higher
- npm or yarn package manager

### Installation Steps

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from template:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` with your MySQL credentials:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=expense_revenue_db
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   ```

5. Initialize the database:
   ```bash
   node init-db.js
   ```

   This script will:
   - Create the database if it doesn't exist
   - Create all necessary tables
   - Insert default admin user (admin@example.com / admin123)
   - Insert 22 default locations

6. Start the server:
   ```bash
   npm run dev     # Development mode with auto-reload
   npm start       # Production mode
   ```

The server will be available at `http://localhost:5000`

## API Endpoints

### Authentication

#### Register
- **Route**: `POST /api/auth/register`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }
  ```
- **Response**: User object with JWT token

#### Login
- **Route**: `POST /api/auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: User object with JWT token

### Data Management

All data endpoints require `Authorization: Bearer <token>` header

#### Add/Update Expense and Revenue
- **Route**: `POST /api/data/add`
- **Auth**: Required (User)
- **Body**:
  ```json
  {
    "location_id": 1,
    "month": 4,
    "year": 2023,
    "expense": 5000.50,
    "revenue": 8000.75
  }
  ```

#### Get Monthly Data (User)
- **Route**: `GET /api/data/monthly?month=4&year=2023&location_id=1`
- **Auth**: Required (User)
- **Returns**: Monthly data for logged-in user

#### Get Yearly Summary (User)
- **Route**: `GET /api/data/yearly?fiscal_year=2023-2024`
- **Auth**: Required (User)
- **Returns**: Yearly aggregated data

#### Get All Monthly Data (Admin)
- **Route**: `GET /api/data/all-monthly?month=4&year=2023&location_id=1`
- **Auth**: Required (Admin)
- **Returns**: All users' monthly data

#### Get All Yearly Data (Admin)
- **Route**: `GET /api/data/all-yearly?fiscal_year=2023-2024&location_id=1`
- **Auth**: Required (Admin)
- **Returns**: All users' yearly data

#### Get Dashboard Summary
- **Route**: `GET /api/data/summary`
- **Auth**: Required (Both roles)
- **Returns**: Overall totals, current year totals, and location-wise summary

### Location Management

#### Get All Locations
- **Route**: `GET /api/locations`
- **Auth**: Required
- **Returns**: Array of all locations

#### Create Location
- **Route**: `POST /api/locations/create`
- **Auth**: Required (Admin)
- **Body**:
  ```json
  {
    "name": "New Location"
  }
  ```

#### Delete Location
- **Route**: `DELETE /api/locations/:id`
- **Auth**: Required (Admin)

## Database Schema

### users
```sql
id (INT, PRIMARY KEY)
name (VARCHAR)
email (VARCHAR, UNIQUE)
password (VARCHAR)
role (ENUM: 'admin', 'user')
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### locations
```sql
id (INT, PRIMARY KEY)
name (VARCHAR, UNIQUE)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### expense_revenue
```sql
id (INT, PRIMARY KEY)
user_id (INT, FOREIGN KEY → users.id)
location_id (INT, FOREIGN KEY → locations.id)
month (INT, 1-12)
year (INT)
expense (DECIMAL)
revenue (DECIMAL)
fiscal_year (VARCHAR)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
UNIQUE (user_id, location_id, month, year)
```

## Fiscal Year Convention

The application uses Indian fiscal year (April to March):
- FY 2023-2024 runs from April 1, 2023 to March 31, 2024

Months are numbered in fiscal year order:
- 1 = April
- 2 = May
- 3 = June
- ...
- 10 = January
- 11 = February
- 12 = March

## Default Locations

The system includes 22 locations from your data:
1. TUMKUR
2. CHIKKA BALLAPUR
3. KOLAR
4. RAMANAGAR
5. DODDABALLAPUR
6. PUTTUR
7. KUNDAPUR
8. HAVERI
9. GADAG
10. DHARWAD
11. CHIKKADRUGA
12. MANDYA
13. MADIKERI
14. CHAMRAJNAGAR
15. HOSTET (Mysuru)
16. KOPPAL
17. RAICHUR
18. CHIKMAGALORE
19. BIDAR
20. CHIKODI
21. HASSAN
22. BAGALKOT

## Security Features

- **Password Security**: bcryptjs with salt rounds 10
- **Authentication**: JWT tokens with configurable expiry
- **Authorization**: Role-based middleware
- **SQL Safety**: Parameterized queries
- **Input Validation**: express-validator
- **CORS**: Configured for frontend domain
- **Environment Variables**: Sensitive data in .env

## Error Handling

API returns standard error responses:
```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start with nodemon for development
- `node init-db.js` - Initialize database

### Project Structure
- `config/` - Database configuration
- `controllers/` - Business logic
- `middleware/` - Authentication, validation
- `routes/` - API routes
- `utils/` - Helper functions

## Troubleshooting

### MySQL Connection Issues
1. Verify MySQL is running
2. Check credentials in .env
3. Ensure database exists or run `node init-db.js`

### Port Already in Use
Change PORT in .env or kill process using port 5000

### JWT Token Errors
- Ensure JWT_SECRET is set in .env
- Check token format: `Bearer <token>`
- Verify token hasn't expired

### Database Initialization Fails
- Check MySQL user has CREATE DATABASE privilege
- Verify sufficient disk space
- Check firewall settings

## Performance Considerations

- Database indexes on frequently queried columns
- Connection pooling with 10 max connections
- Pagination ready for large datasets
- Efficient aggregate queries
- UNIQUE constraints to prevent duplicates

## Future Enhancements

- Export to Excel/CSV
- Email notifications
- Bulk data import
- API rate limiting
- Data archiving
- Advanced filtering and search
- Audit logging
- Two-factor authentication
