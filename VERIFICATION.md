# Setup Verification Checklist

Use this guide to verify your installation is complete and working correctly.

## Pre-Installation Requirements

- [ ] Node.js v14+ installed: `node --version`
- [ ] npm installed: `npm --version`
- [ ] MySQL 5.7+ installed and running
- [ ] Port 5000 is available (backend)
- [ ] Port 3000 is available (frontend)
- [ ] 500 MB disk space available

## Backend Setup

### 1. Dependencies
```bash
cd backend
npm install
```
- [ ] No errors during installation
- [ ] `node_modules/` folder created
- [ ] `package-lock.json` created

### 2. Environment Configuration
```bash
cp .env.example .env
# Edit .env with MySQL credentials
```
- [ ] `.env` file created
- [ ] `DB_HOST` set to your MySQL host (default: localhost)
- [ ] `DB_USER` set to your MySQL user (default: root)
- [ ] `DB_PASSWORD` set to your MySQL password
- [ ] `DB_NAME` set (default: expense_revenue_db)
- [ ] `JWT_SECRET` set to a secure value
- [ ] `PORT` set to 5000 (or your preferred port)

### 3. Database Initialization
```bash
node init-db.js
```
- [ ] Script runs without errors
- [ ] Database `expense_revenue_db` created
- [ ] Tables created: users, locations, expense_revenue
- [ ] Default admin user created
- [ ] 22 locations created

Verify in MySQL:
```sql
USE expense_revenue_db;
SHOW TABLES;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM locations;
```

### 4. Start Backend Server
```bash
npm run dev
```
- [ ] Server starts on port 5000
- [ ] Message: "Server is running on http://localhost:5000"
- [ ] No error messages
- [ ] Database connection successful

Test health endpoint:
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"Backend server is running"}
```

## Frontend Setup

### 1. Dependencies
```bash
cd frontend
npm install
```
- [ ] No errors during installation
- [ ] `node_modules/` folder created
- [ ] `package-lock.json` created

### 2. Environment Configuration
```bash
cp .env.example .env
```
- [ ] `.env` file created
- [ ] `VITE_API_URL` set to `http://localhost:5000`

### 3. Start Frontend Server
```bash
npm run dev
```
- [ ] Vite dev server starts
- [ ] Message includes "http://localhost:3000"
- [ ] No compilation errors
- [ ] Application compiles successfully

## Application Testing

### 1. Access Application
- [ ] Open http://localhost:3000 in browser
- [ ] Page loads without errors
- [ ] Login form displays

### 2. Admin Login
```
Email: admin@example.com
Password: admin123
```
- [ ] Login successful
- [ ] Redirected to admin dashboard
- [ ] Dashboard displays stat cards
- [ ] Dashboard displays charts
- [ ] Sidebar shows admin menu options

### 3. Admin Dashboard Features
- [ ] Overview stat cards show values (even if 0)
- [ ] Monthly bar chart displays
- [ ] Monthly trend line chart displays
- [ ] Location filter dropdown works
- [ ] Fiscal year dropdown works
- [ ] Location summary table displays
- [ ] Can see user entries table (if any exist)
- [ ] Logout button works

### 4. Create User Account
- [ ] Click Register link
- [ ] Fill in Name, Email, Password
- [ ] Select "User" role
- [ ] Click Register
- [ ] Account created successfully
- [ ] Logged in automatically
- [ ] Redirected to user dashboard

### 5. User Dashboard
- [ ] Stat cards display
- [ ] Charts render
- [ ] Location filter works
- [ ] "Enter Data" option available in sidebar

### 6. Data Entry
- [ ] Navigate to "Enter Data" page
- [ ] All form fields load
- [ ] Location dropdown shows 22 locations
- [ ] Can select month (April - March)
- [ ] Can enter expense amount
- [ ] Can enter revenue amount
- [ ] Submit button works
- [ ] Success message displays
- [ ] Data persists after refresh

### 7. View Entered Data
- [ ] Go back to User Dashboard
- [ ] Newly entered data shows in charts
- [ ] Location summary updates
- [ ] Stat cards update with new totals

### 8. Admin Verification
- [ ] Login as admin again
- [ ] Admin Dashboard shows user's entered data
- [ ] All entries table shows new entries
- [ ] Location-wise charts include new data

## API Testing

### Test with curl or Postman

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Get locations
curl http://localhost:5000/api/locations \
  -H "Authorization: Bearer <token>"

# Get dashboard summary
curl http://localhost:5000/api/data/summary \
  -H "Authorization: Bearer <token>"
```

- [ ] Login endpoint returns token
- [ ] Locations endpoint returns 22 locations
- [ ] Summary endpoint returns aggregated data
- [ ] Protected endpoints require authorization header
- [ ] Invalid tokens return 403 error

## Performance Checks

- [ ] Page load time < 2 seconds
- [ ] Charts render smoothly
- [ ] Form submission completes quickly
- [ ] No console errors
- [ ] No memory leaks (check DevTools)

## Browser Compatibility

Test on:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (if on macOS)
- [ ] Edge

Verify on each:
- [ ] No layout issues
- [ ] Charts render correctly
- [ ] Forms are functional
- [ ] Navigation works

## Mobile Responsiveness

- [ ] Sidebar is usable on mobile
- [ ] Charts resize on mobile
- [ ] Forms are readable on mobile
- [ ] Buttons are clickable on mobile
- [ ] No horizontal scrolling issues

## Data Persistence

- [ ] Refresh page - data persists
- [ ] Clear browser cache - can re-login
- [ ] Multiple sessions work independently
- [ ] Concurrent data entry works

## Security Checks

- [ ] Cannot access protected routes without login
- [ ] Cannot access admin routes as user
- [ ] Cannot modify other users' data
- [ ] Passwords are not displayed
- [ ] JWT tokens expire (after 7 days)
- [ ] Invalid credentials rejected

## Common Issues & Solutions

### Issue: MySQL Connection Failed
```
Solution: 
1. Verify MySQL is running: mysql -u root
2. Check .env credentials
3. Re-run: node init-db.js
```

### Issue: Port 5000/3000 Already in Use
```bash
# macOS/Linux
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: CORS Errors
```
Solution:
1. Ensure backend is running on port 5000
2. Check frontend vite.config.js proxy settings
3. Verify API URL in .env
```

### Issue: Modules Not Found
```bash
cd backend && npm install
cd frontend && npm install
```

## Sign-Off

Once all items are checked, your installation is complete and verified!

### Final Verification
- [ ] Backend runs: `npm run dev` (in backend/)
- [ ] Frontend runs: `npm run dev` (in frontend/)
- [ ] Can login with admin@example.com / admin123
- [ ] Can create new user account
- [ ] Can enter and view data
- [ ] All charts display correctly
- [ ] Mobile view is responsive
- [ ] No console errors
- [ ] No obvious bugs detected

**Installation Date**: _______________

**Verified By**: _______________

**Status**: ✅ COMPLETE AND READY FOR USE

---

For detailed documentation, see:
- `README.md` - Full project overview
- `QUICKSTART.md` - Quick start guide
- `backend/README.md` - Backend documentation
- `frontend/README.md` - Frontend documentation
- `DELIVERY.md` - Delivery summary
