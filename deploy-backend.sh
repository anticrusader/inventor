#!/bin/bash

# Install production dependencies
cd backend
npm install --production

# Copy production environment file
cp .env.production .env

# Start the server using PM2
pm2 start server.js --name "inventor-backend"
