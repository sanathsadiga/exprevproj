#!/bin/bash

# Deployment Script for Expense and Revenue Dashboard
# Run this on the server

echo "================================"
echo "Deploying Expense Dashboard"
echo "================================"

# Update system
echo "1. Updating system..."
sudo apt update
sudo apt upgrade -y

# Install Node.js
echo "2. Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
echo "3. Installing MySQL..."
sudo apt install -y mysql-server

# Install PM2
echo "4. Installing PM2..."
sudo npm install -g pm2

# Create app directory
echo "5. Creating app directory..."
sudo mkdir -p /var/www/exprevproj
cd /var/www/exprevproj

echo "================================"
echo "Now upload your project files here:"
echo "scp -r /Users/sanathsadiga/Desktop/exprevproj/* root@76.13.19.45:/var/www/exprevproj/"
echo "================================"
