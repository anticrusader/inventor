const config = {
  API_URL: process.env.REACT_APP_API_URL || 
    (process.env.NODE_ENV === 'production'
      ? 'https://inventor-dv3d.onrender.com/api'
      : 'http://localhost:5001/api')
};

export default config;
