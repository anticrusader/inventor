const config = {
  API_URL: process.env.NODE_ENV === 'production'
    ? 'https://inventor-dv3d.onrender.com'  // Production backend URL
    : 'http://localhost:5001'  // Development URL
};

console.log('Current API URL:', config.API_URL);
console.log('Current environment:', process.env.NODE_ENV);

export default config;
