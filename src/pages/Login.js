import React from 'react';
import { Box, Paper, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}
      >
        <Typography variant="h4" component="h1" align="center">
          Login
        </Typography>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TextField
            label="Email"
            type="email"
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            required
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
