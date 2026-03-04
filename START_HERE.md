#!/usr/bin/env node

# 🎯 EXPENSE AND REVENUE MANAGEMENT DASHBOARD

## What You Have

A **complete, production-ready full-stack application** for managing location-wise expense and revenue data with professional dashboards.

---

## ⚡ Quick Start (5 minutes)

### Step 1: Open Terminal & Navigate
```bash
cd /Users/sanathsadiga/Desktop/exprevproj
```

### Step 2: Run Setup Script
**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```bash
setup.bat
```

### Step 3: Configure Database
Edit `backend/.env`:
```
DB_USER=root
DB_PASSWORD=your_mysql_password
```

### Step 4: Initialize Database
```bash
cd backend
node init-db.js
```

### Step 5: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 6: Login
Open: http://localhost:3000
- **Email**: admin@example.com
- **Password**: admin123

---

## 📚 Documentation

| Document | Purpose | Read Time |
|----------|---------|-----------|
| **INDEX.md** | 📋 Complete guide to all docs | 5 min |
| **QUICKSTART.md** | ⚡ Fast setup guide | 5 min |
| **README.md** | 📖 Full project documentation | 15 min |
| **DELIVERY.md** | 📦 What was built & how to use | 10 min |
| **VERIFICATION.md** | ✅ Setup verification checklist | 10 min |
| **backend/README.md** | 🔌 API endpoints & backend setup | 20 min |
| **frontend/README.md** | 🎨 Features & components | 15 min |

**👉 START HERE**: Read `INDEX.md` for complete navigation guide.

---

## ✨ Key Features

### 👥 For Users
- Enter monthly expense & revenue data
- View personal dashboard with charts
- Monthly & yearly analysis
- Location-wise performance breakdown

### 👨‍💼 For Admins
- Monitor all users' data in real-time
- Comprehensive dashboards
- Location performance metrics
- Fiscal year reports (April-March)
- User activity tracking

### 📊 Dashboard Features
- Bar charts (Expense vs Revenue)
- Line charts (Trends)
- Pie charts (Distribution)
- Statistical overview cards
- Filterable data tables
- Responsive mobile design

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Recharts, Zustand, Axios
- **Backend**: Node.js, Express, MySQL
- **Database**: 22 pre-configured locations, Fiscal year support
- **Security**: JWT, bcryptjs, Role-based access control
- **Design**: Responsive CSS, No emojis

---

## 📊 What's Included

✅ **Backend API** - 11 endpoints
✅ **React Frontend** - 5 pages + components
✅ **MySQL Database** - Auto-initialized
✅ **Authentication** - Secure JWT
✅ **Charts & Analytics** - Recharts integration
✅ **Responsive Design** - Mobile optimized
✅ **Complete Documentation** - 7 documents
✅ **Setup Scripts** - Mac/Linux & Windows

---

## 🗂️ Project Structure

```
exprevproj/
├── backend/              # Express.js API
│   ├── controllers/      # Business logic
│   ├── routes/           # API routes
│   ├── config/           # Database setup
│   └── server.js         # Main server
│
├── frontend/             # React App
│   ├── src/pages/        # Dashboard pages
│   ├── src/components/   # UI components
│   ├── src/styles/       # CSS styling
│   └── src/store/        # State management
│
├── Documentation/
│   ├── INDEX.md          # Navigation guide
│   ├── QUICKSTART.md     # 5-min setup
│   ├── README.md         # Full docs
│   ├── DELIVERY.md       # What's built
│   └── VERIFICATION.md   # Verification checklist
└── Setup Scripts/
    ├── setup.sh          # Mac/Linux
    └── setup.bat         # Windows
```

---

## 🔐 Security Features

- JWT token authentication (7-day expiry)
- Password hashing with bcryptjs
- Role-based access control
- SQL injection prevention
- Environment variable management
- Input validation

---

## 📋 Default Locations (22 Total)

TUMKUR, CHIKKA BALLAPUR, KOLAR, RAMANAGAR, DODDABALLAPUR, PUTTUR, KUNDAPUR, HAVERI, GADAG, DHARWAD, CHIKKADRUGA, MANDYA, MADIKERI, CHAMRAJNAGAR, HOSTET (Mysuru), KOPPAL, RAICHUR, CHIKMAGALORE, BIDAR, CHIKODI, HASSAN, BAGALKOT

---

## 🔗 API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/data/add` - Add expense/revenue
- `GET /api/data/monthly` - Monthly data
- `GET /api/data/yearly` - Yearly summary
- `GET /api/data/summary` - Dashboard stats
- `GET /api/locations` - All locations

**See `backend/README.md` for complete API documentation.**

---

## ✅ System Requirements

- Node.js 14+
- MySQL 5.7+
- Modern web browser
- 500 MB disk space

---

## 🚀 Getting Started

### For First-Time Users:
1. Read: **INDEX.md** (navigation guide)
2. Run: **setup.sh** or **setup.bat**
3. Configure: **backend/.env**
4. Initialize: **node init-db.js**
5. Start: **npm run dev** (both terminal windows)
6. Access: **http://localhost:3000**

### For Experienced Developers:
- See **DELIVERY.md** for detailed architecture
- Check **backend/README.md** for API specs
- Review **frontend/README.md** for component structure

---

## 🐛 Troubleshooting

### Common Issues:

**Port Already in Use**
```bash
# macOS/Linux
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

**MySQL Connection Error**
- Verify MySQL is running
- Check credentials in `backend/.env`
- Re-run: `node init-db.js`

**Modules Not Found**
```bash
cd backend && npm install
cd frontend && npm install
```

**See VERIFICATION.md for complete troubleshooting guide.**

---

## 📈 Features Overview

### Monthly Data Entry
- Select location
- Choose month (April-March fiscal year)
- Enter expense & revenue amounts
- Auto-calculated totals

### Monthly Analysis
- Bar charts showing expense vs revenue
- Line charts showing trends
- Monthly comparison across years
- Location-wise breakdown

### Yearly Reports
- Fiscal year summaries (April-March)
- Yearly profit/loss calculations
- Location performance metrics
- Year-over-year comparison

### Admin Features
- View all users' data
- Monitor location performance
- User activity tracking
- Comprehensive dashboards
- Data filtering by location & period

---

## 🎯 Next Steps

1. **Now**: Read `INDEX.md` for complete guide
2. **Setup**: Run `setup.sh` (or `setup.bat` on Windows)
3. **Configure**: Update `backend/.env` with MySQL credentials
4. **Initialize**: Run `node init-db.js`
5. **Start**: Run backend & frontend servers
6. **Access**: Open http://localhost:3000
7. **Verify**: Use `VERIFICATION.md` checklist
8. **Explore**: Try all features and dashboards

---

## 📞 Support

- **Quick Start**: See `QUICKSTART.md`
- **Full Docs**: See `README.md`
- **API Docs**: See `backend/README.md`
- **Setup Guide**: See `INDEX.md`
- **Verification**: See `VERIFICATION.md`

---

## 🎉 Ready to Use!

Everything is set up and ready to go. Just run the setup script and follow the prompts.

**Questions?** Check the documentation files.

**Issues?** See `VERIFICATION.md` troubleshooting section.

---

## 📝 Project Information

- **Type**: Full-stack Expense/Revenue Dashboard
- **Created**: March 4, 2026
- **Status**: ✅ Complete & Production-Ready
- **Default Admin**: admin@example.com / admin123
- **License**: MIT

---

## 💡 Pro Tips

- Change admin password immediately in production
- Configure strong JWT_SECRET in `.env`
- Regular database backups recommended
- Test on mobile before deploying
- Use HTTPS in production

---

**Enjoy your Expense and Revenue Management Dashboard! 🚀**

For detailed step-by-step instructions, see **INDEX.md** or **QUICKSTART.md**.
