#!/bin/bash

# Build the React app
echo "Building React frontend..."
npm run build

# Install production dependencies
echo "Installing backend dependencies..."
cd backend
npm install --production

# Copy production environment file
echo "Setting up production environment..."
cp .env.production .env

# Install PM2 globally if not already installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

# Start the server using PM2
echo "Starting server with PM2..."
pm2 start server.js --name "inventor"

echo "Deployment complete!"
