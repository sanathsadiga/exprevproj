# Deployment Guide - Expense and Revenue Dashboard

This guide will help you deploy the Expense and Revenue Dashboard to your Ubuntu server at `76.13.19.45`.

## Prerequisites

- Ubuntu 25.10 server
- SSH access to the server
- Root or sudo privileges

## Deployment Steps

### Step 1: Connect to Your Server

```bash
ssh root@76.13.19.45
```

### Step 2: Update System and Install Dependencies

```bash
# Update system packages
sudo apt update
sudo apt upgrade -y

# Install Node.js and npm (if not installed)
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL server (if not installed)
sudo apt install -y mysql-server

# Install Git (if not installed)
sudo apt install -y git

# Install PM2 for process management
sudo npm install -g pm2
```

### Step 3: Clone/Upload Project to Server

**Option A: Using Git (if your project is in a Git repository)**
```bash
cd /home
sudo git clone <your-repository-url> exprevproj
cd exprevproj
```

**Option B: Upload using SCP**
```bash
# From your local machine
scp -r /Users/sanathsadiga/Desktop/exprevproj root@76.13.19.45:/home/
```

### Step 4: Set Up MySQL Database

```bash
# Connect to MySQL
sudo mysql -u root

# Run the initialization script
# (Inside mysql prompt or from command line)
mysql -u root < /home/exprevproj/backend/init-db.js
```

**Or manually:**
```sql
CREATE DATABASE expense_revenue_db;
USE expense_revenue_db;

-- Run the init-db.js content here
```

### Step 5: Configure Environment Variables

```bash
cd /home/exprevproj/backend

# Create .env file
sudo nano .env
```

Add the following content:
```env
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=expense_revenue_db
JWT_SECRET=your_secure_jwt_secret_key_here
NODE_ENV=production
```

### Step 6: Install Dependencies

```bash
# Backend
cd /home/exprevproj/backend
npm install

# Frontend
cd /home/exprevproj/frontend
npm install
```

### Step 7: Build Frontend

```bash
cd /home/exprevproj/frontend
npm run build
```

### Step 8: Set Up PM2 for Process Management

```bash
# Start backend with PM2
cd /home/exprevproj/backend
sudo pm2 start server.js --name "expense-backend"

# Start frontend with PM2 (using a simple HTTP server)
cd /home/exprevproj/frontend/dist
sudo pm2 start "python3 -m http.server 3000" --name "expense-frontend"

# Or use Node.js http-server
npm install -g http-server
sudo pm2 start "http-server -p 3000 -d false" --name "expense-frontend" --cwd /home/exprevproj/frontend/dist

# Save PM2 startup
sudo pm2 startup
sudo pm2 save
```

### Step 9: Set Up Nginx as Reverse Proxy (Optional but Recommended)

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/exprevproj
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name 76.13.19.45;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the configuration:
```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/exprevproj /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 10: Set Up SSL Certificate (Optional but Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d 76.13.19.45
```

### Step 11: Configure Firewall

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Allow application ports
sudo ufw allow 3000/tcp
sudo ufw allow 5001/tcp

# Enable firewall
sudo ufw enable
```

### Step 12: Verify Deployment

```bash
# Check PM2 status
sudo pm2 status

# Check Nginx status
sudo systemctl status nginx

# Check if ports are listening
sudo netstat -tuln | grep -E '3000|5001|80|443'

# Test backend API
curl http://localhost:5001/api/health

# Check logs
sudo pm2 logs
```

## Accessing Your Application

Once deployed:
- **Frontend**: http://76.13.19.45
- **Backend API**: http://76.13.19.45/api

## Default Login Credentials

- **Email**: admin@example.com
- **Password**: admin123

## Troubleshooting

### Check PM2 Logs
```bash
sudo pm2 logs expense-backend
sudo pm2 logs expense-frontend
```

### Check Nginx Logs
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Check MySQL Status
```bash
sudo systemctl status mysql
sudo mysql -u root -p -e "SELECT VERSION();"
```

### Restart Services
```bash
sudo pm2 restart all
sudo systemctl restart nginx
sudo systemctl restart mysql
```

## Maintenance

### Update Application

```bash
# Pull latest code
cd /home/exprevproj
git pull origin main

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Rebuild frontend
npm run build

# Restart services
sudo pm2 restart all
```

### Database Backup

```bash
# Backup database
mysqldump -u root -p expense_revenue_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
mysql -u root -p expense_revenue_db < backup_20260304_101754.sql
```

## Security Recommendations

1. Change default admin password after first login
2. Use strong JWT secret in .env
3. Enable HTTPS/SSL certificate
4. Configure proper MySQL user permissions (don't use root for app)
5. Set up regular backups
6. Monitor system resources and logs
7. Keep Ubuntu packages updated regularly

## Support

For issues or questions, refer to the project README.md or troubleshoot using the logs mentioned above.
