const config = {
  API_URL: process.env.NODE_ENV === 'production'
    ? 'https://inventor-backend-dv3d.onrender.com'  // Production backend URL
    : 'http://localhost:5001'  // Development URL
};

export default config;
