## Backend Setup

The backend is built with Node.js, Express, and MySQL.

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server (5.7 or higher)
- npm or yarn

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file by copying `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your MySQL credentials:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=expense_revenue_db
JWT_SECRET=your_secret_key_change_this
NODE_ENV=development
```

### Database Setup

Run the database initialization script:
```bash
node init-db.js
```

This will:
- Create the database
- Create all necessary tables
- Create a default admin user (admin@example.com / admin123)
- Add default location data

### Start the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on http://localhost:5000

## Frontend Setup

The frontend is built with React and Vite.

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The application will run on http://localhost:3000

### Build for Production

```bash
npm run build
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Data Management
- `POST /api/data/add` - Add expense/revenue entry
- `GET /api/data/monthly` - Get monthly data for logged-in user
- `GET /api/data/yearly` - Get yearly summary
- `GET /api/data/all-monthly` - Get all monthly data (admin only)
- `GET /api/data/all-yearly` - Get all yearly data (admin only)
- `GET /api/data/summary` - Get dashboard summary

### Locations
- `GET /api/locations` - Get all locations
- `POST /api/locations/create` - Create new location (admin only)
- `DELETE /api/locations/:id` - Delete location (admin only)

## Features

### User Role
- View personal dashboard with expense and revenue data
- Enter monthly expense and revenue data for locations
- View monthly and yearly summaries
- View location-wise analysis
- Download reports (upcoming)

### Admin Role
- Monitor all users' data
- View comprehensive dashboards with all data
- View location-wise performance
- Manage locations
- View fiscal year summaries (April to March)
- Generate reports (upcoming)

## Data Format

### Fiscal Year
The application uses the Indian fiscal year format (April to March):
- Fiscal Year 2023-2024 = April 1, 2023 to March 31, 2024

### Months
Months are numbered 1-12 in the fiscal year order:
- 1 = April
- 2 = May
- ...
- 10 = January
- 11 = February
- 12 = March

## Database Schema

### Users Table
- id (AUTO_INCREMENT PRIMARY KEY)
- name
- email (UNIQUE)
- password
- role (admin/user)
- created_at
- updated_at

### Locations Table
- id (AUTO_INCREMENT PRIMARY KEY)
- name (UNIQUE)
- created_at
- updated_at

### Expense_Revenue Table
- id (AUTO_INCREMENT PRIMARY KEY)
- user_id (FOREIGN KEY)
- location_id (FOREIGN KEY)
- month
- year
- expense (DECIMAL)
- revenue (DECIMAL)
- fiscal_year
- created_at
- updated_at
- UNIQUE constraint on (user_id, location_id, month, year)

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control
- Input validation
- SQL injection prevention with parameterized queries
- CORS configuration
- Environment variable management

## Troubleshooting

### Database Connection Error
- Ensure MySQL server is running
- Check credentials in `.env` file
- Verify database exists

### Port Already in Use
- Backend default: 5000
- Frontend default: 3000
- Change ports in `.env` and vite.config.js if needed

### Module Not Found
- Run `npm install` in both backend and frontend directories
- Clear node_modules and npm cache if issues persist

## Default Locations

The system comes with 22 default locations from the data sheet:
TUMKUR, CHIKKA BALLAPUR, KOLAR, RAMANAGAR, DODDABALLAPUR, PUTTUR, KUNDAPUR, HAVERI, GADAG, DHARWAD, CHIKKADRUGA, MANDYA, MADIKERI, CHAMRAJNAGAR, HOSTET (Mysuru), KOPPAL, RAICHUR, CHIKMAGALORE, BIDAR, CHIKODI, HASSAN, BAGALKOT
