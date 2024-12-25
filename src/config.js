const config = {
  API_URL: process.env.NODE_ENV === 'production'
    ? 'https://inventor-dv3d.onrender.com/api'  // In production, use Render URL
    : 'http://localhost:5001/api'  // In development, use localhost
};

export default config;
