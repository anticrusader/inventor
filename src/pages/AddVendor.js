import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AddVendor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fname: '',
    lname: ''
  });
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fname.trim()) {
      setError('First name is required');
      return;
    }

    try {
      const dataToSend = {
        fname: formData.fname.trim(),
        lname: formData.lname.trim()
      };
      await api.addVendor(dataToSend);
      setOpenSnackbar(true);
      // Clear form
      setFormData({ fname: '', lname: '' });
      setTimeout(() => {
        navigate('/vendors');
      }, 2000);
    } catch (err) {
      console.error('Error adding vendor:', err);
      setError(err.response?.data?.message || 'Error adding vendor');
    }
  };

  const handleCancel = () => {
    navigate('/vendors');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Add New Vendor
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="First Name"
            name="fname"
            value={formData.fname}
            onChange={handleChange}
            required
            error={!!error}
            helperText={error}
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lname"
            value={formData.lname}
            onChange={handleChange}
            sx={{ mb: 3 }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!formData.fname.trim()}
            >
              Add Vendor
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Vendor added successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddVendor;
