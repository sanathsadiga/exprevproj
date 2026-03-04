@echo off
REM Expense and Revenue Dashboard - Setup Script for Windows

echo Setting up Expense and Revenue Dashboard...
echo.

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js v14 or higher.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo Node.js version: %NODE_VERSION%
echo.

REM Setup Backend
echo Setting up Backend...
cd backend

if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo Please update backend\.env with your MySQL credentials
)

echo Installing backend dependencies...
call npm install

echo.
echo Backend setup complete!
echo.

REM Setup Frontend
cd ..\frontend

echo Installing frontend dependencies...
call npm install

echo.
echo Frontend setup complete!
echo.

cd ..

echo Setup complete! Next steps:
echo.
echo 1. Update backend\.env with your MySQL credentials
echo 2. Run database initialization: cd backend ^&^& node init-db.js
echo 3. Start backend: cd backend ^&^& npm run dev
echo 4. In another terminal, start frontend: cd frontend ^&^& npm run dev
echo 5. Open http://localhost:3000 in your browser
echo.
echo Default login: admin@example.com / admin123
