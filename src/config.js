const config = {
  API_URL: process.env.NODE_ENV === 'production'
    ? 'https://inventor-backend-dv3d.onrender.com/api'  // Production backend URL
    : 'http://localhost:5001/api'  // Development URL
};

console.log('Current API URL:', config.API_URL);
console.log('Current environment:', process.env.NODE_ENV);

export default config;
