#!/bin/bash

# Build the React app
npm run build

# Deploy to your hosting service
# Example for Netlify:
# netlify deploy --prod

# Example for Vercel:
# vercel --prod

# Example for AWS S3:
# aws s3 sync build/ s3://your-bucket-name
