import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import axios from 'axios';

const Profile = () => {
  const [personalInfo, setPersonalInfo] = useState({
    username: '',
    email: '',
  });
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    setPersonalInfo({
      username: user.username || '',
      email: user.email || '',
    });
  }, [user]);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateEmail = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5001/api/auth/update-email', {
        userId: user._id,
        email: personalInfo.email
      });

      if (response.data.success) {
        // Update local storage
        const updatedUser = {
          ...user,
          email: personalInfo.email
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setMessage({ type: 'success', text: 'Email updated successfully' });
      }
    } catch (error) {
      console.error('Error updating email:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error updating email'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
        setMessage({ type: 'error', text: 'New passwords do not match' });
        return;
      }

      setLoading(true);
      const response = await axios.post('http://localhost:5001/api/auth/change-password', {
        userId: user._id,
        currentPassword: passwordInfo.currentPassword,
        newPassword: passwordInfo.newPassword
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Password updated successfully' });
        setPasswordInfo({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error updating password'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPersonalInfo = () => {
    setPersonalInfo({
      username: user.username || '',
      email: user.email || ''
    });
  };

  const resetPasswordInfo = () => {
    setPasswordInfo({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>
        Profile
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Left Column - Personal Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#1A1F2D' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ color: 'white' }}>Personal Information</Typography>
              <Box>
                <Button 
                  variant="outlined" 
                  onClick={resetPersonalInfo}
                  sx={{ 
                    mr: 1,
                    color: '#10B981',
                    borderColor: '#10B981',
                    '&:hover': {
                      borderColor: '#059669',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    }
                  }}
                >
                  Reset
                </Button>
                <Button 
                  variant="contained"
                  onClick={handleUpdateEmail}
                  disabled={loading}
                  sx={{
                    bgcolor: '#FE8A00',
                    '&:hover': {
                      bgcolor: '#E67A00',
                    },
                  }}
                >
                  Update
                </Button>
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={personalInfo.username}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10B981',
                      },
                      '& input': {
                        color: 'white',
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={handlePersonalInfoChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10B981',
                      },
                      '& input': {
                        color: 'white',
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Right Column - Password */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: '#1A1F2D' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ color: 'white' }}>Password</Typography>
              <Box>
                <Button 
                  variant="outlined" 
                  onClick={resetPasswordInfo}
                  sx={{ 
                    mr: 1,
                    color: '#10B981',
                    borderColor: '#10B981',
                    '&:hover': {
                      borderColor: '#059669',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    }
                  }}
                >
                  Reset
                </Button>
                <Button 
                  variant="contained"
                  onClick={handleUpdatePassword}
                  disabled={loading}
                  sx={{
                    bgcolor: '#FE8A00',
                    '&:hover': {
                      bgcolor: '#E67A00',
                    },
                  }}
                >
                  Update
                </Button>
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={passwordInfo.currentPassword}
                  onChange={handlePasswordChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10B981',
                      },
                      '& input': {
                        color: 'white',
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwordInfo.newPassword}
                  onChange={handlePasswordChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10B981',
                      },
                      '& input': {
                        color: 'white',
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={passwordInfo.confirmPassword}
                  onChange={handlePasswordChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10B981',
                      },
                      '& input': {
                        color: 'white',
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
