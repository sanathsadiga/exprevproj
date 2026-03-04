# Expense and Revenue Management Dashboard

A full-stack web application for managing expense and revenue data across multiple locations. Built with React, Node.js/Express, and MySQL.

## Features

### For Users
- Enter location-wise monthly expense and revenue data
- View personal dashboard with charts and analytics
- Track monthly and yearly trends
- Location-wise performance analysis
- Automatic calculations of totals and net profit

### For Admins
- Monitor all users' data in real-time
- Comprehensive dashboard with aggregated data
- Location-wise performance metrics
- Monthly and yearly analysis
- Fiscal year reports (April to March)
- User activity tracking
- Location management

### Dashboard Features
- Bar charts for expense vs revenue comparison
- Line charts for trend analysis
- Pie charts for distribution analysis
- Statistical cards for quick overview
- Filterable tables for detailed data
- Responsive design for mobile and desktop
- Real-time data updates

## Tech Stack

### Frontend
- React 18
- React Router for navigation
- Axios for API calls
- Recharts for data visualization
- Zustand for state management
- Vite as build tool
- CSS3 for styling

### Backend
- Node.js with Express
- MySQL with mysql2/promise
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled
- Input validation

### Database
- MySQL Server
- Relational schema with proper indexing
- Foreign key constraints
- Unique constraints for data integrity

## Project Structure

```
exprevproj/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dataController.js
│   │   └── locationController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dataRoutes.js
│   │   └── locationRoutes.js
│   ├── utils/
│   │   └── helpers.js
│   ├── server.js
│   ├── init-db.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js
│   │   ├── components/
│   │   │   ├── Charts.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── StatCard.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── DataEntry.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── UserDashboard.jsx
│   │   ├── store/
│   │   │   └── authStore.js
│   │   ├── styles/
│   │   │   ├── charts.css
│   │   │   ├── forms.css
│   │   │   ├── global.css
│   │   │   └── layout.css
│   │   ├── utils/
│   │   │   └── constants.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   └── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 14+
- MySQL 5.7+

### Setup

1. Clone/Extract the project
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Configure backend:
   - Copy `.env.example` to `.env`
   - Update database credentials

4. Initialize database:
   ```bash
   node init-db.js
   ```

5. Start backend:
   ```bash
   npm run dev
   ```

6. In another terminal, setup frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

7. Open http://localhost:3000 in your browser

## Default Login

- Email: `admin@example.com`
- Password: `admin123`

## API Documentation

See backend README for detailed API endpoints and usage.

## License

MIT License - Feel free to use this project for your needs.
