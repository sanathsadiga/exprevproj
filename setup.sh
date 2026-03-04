#!/bin/bash

# Expense and Revenue Dashboard - Setup Script

echo "Setting up Expense and Revenue Dashboard..."
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi

echo "Node.js version: $(node --version)"
echo ""

# Setup Backend
echo "Setting up Backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "Please update backend/.env with your MySQL credentials"
fi

echo "Installing backend dependencies..."
npm install

echo ""
echo "Backend setup complete!"
echo ""

# Setup Frontend
cd ../frontend

echo "Installing frontend dependencies..."
npm install

echo ""
echo "Frontend setup complete!"
echo ""

cd ..

echo "Setup complete! Next steps:"
echo ""
echo "1. Update backend/.env with your MySQL credentials"
echo "2. Run database initialization: cd backend && node init-db.js"
echo "3. Start backend: cd backend && npm run dev"
echo "4. In another terminal, start frontend: cd frontend && npm run dev"
echo "5. Open http://localhost:3000 in your browser"
echo ""
echo "Default login: admin@example.com / admin123"
