# Quick Start Guide

## System Requirements

- Node.js 14+ ([Download](https://nodejs.org/))
- MySQL 5.7+ ([Download](https://www.mysql.com/downloads/))
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Installation

### 1. Automatic Setup (Recommended)

**On macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**On Windows:**
```bash
setup.bat
```

### 2. Manual Setup

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
npm install
node init-db.js  # Initialize database
npm run dev      # Start server
```

**Frontend (in another terminal):**
```bash
cd frontend
npm install
npm run dev
```

## Accessing the Application

- **URL**: http://localhost:3000
- **Default Admin**: admin@example.com / admin123
- **Backend API**: http://localhost:5000

## File Structure

```
exprevproj/
├── backend/           # Express.js server
├── frontend/          # React application
├── README.md          # Main documentation
├── setup.sh          # Linux/macOS setup
└── setup.bat         # Windows setup
```

## Default Locations

The system comes with 22 pre-configured locations from your data:
- TUMKUR, CHIKKA BALLAPUR, KOLAR, RAMANAGAR, DODDABALLAPUR, PUTTUR
- KUNDAPUR, HAVERI, GADAG, DHARWAD, CHIKKADRUGA, MANDYA
- MADIKERI, CHAMRAJNAGAR, HOSTET (Mysuru), KOPPAL, RAICHUR
- CHIKMAGALORE, BIDAR, CHIKODI, HASSAN, BAGALKOT

## Features

### User Dashboard
- View personal expense/revenue data
- Enter monthly data for locations
- Monthly and yearly analytics
- Location-wise performance

### Admin Dashboard
- Monitor all users' data
- Comprehensive reporting
- Location performance metrics
- Fiscal year analysis (April-March)
- Data aggregation and trends

## Key Functionality

✓ User Authentication (Login/Register)
✓ Role-Based Access Control
✓ Monthly Data Entry
✓ Automatic Calculations
✓ Charts & Visualizations
✓ Monthly & Yearly Reports
✓ Location-wise Analysis
✓ Fiscal Year Support (April-March)
✓ Responsive Design
✓ Secure Database

## Troubleshooting

### Port Already in Use
```bash
# Change port in .env or kill the process
# macOS/Linux
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MySQL Connection Error
1. Ensure MySQL is running
2. Check credentials in `backend/.env`
3. Verify database permissions
4. Run `node init-db.js` again

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Database Schema

- **users**: Authentication and roles
- **locations**: Location data
- **expense_revenue**: Monthly expense/revenue entries

## API Overview

**Authentication:**
- POST `/api/auth/register`
- POST `/api/auth/login`

**Data:**
- POST `/api/data/add`
- GET `/api/data/monthly`
- GET `/api/data/yearly`
- GET `/api/data/summary`
- GET `/api/data/all-monthly` (Admin)
- GET `/api/data/all-yearly` (Admin)

**Locations:**
- GET `/api/locations`
- POST `/api/locations/create` (Admin)
- DELETE `/api/locations/:id` (Admin)

## Support

For detailed documentation, see:
- `backend/README.md` - Backend setup and API details
- `frontend/README.md` - Frontend features and components
- `README.md` - Full project documentation

## Security Notes

- Change default admin password immediately
- Update JWT_SECRET in `.env`
- Use strong MySQL password
- Enable HTTPS in production
- Set NODE_ENV=production for production deployment

---

**Ready to start?** Run the setup script and follow the on-screen instructions!
