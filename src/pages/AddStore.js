import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AddStore = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [store, setStore] = useState({
    name: '',
    area: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStore(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.addStore(store);
      navigate('/stores');
    } catch (error) {
      console.error('Error adding store:', error);
      alert('Failed to add store. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Add Store
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Store Name"
              name="name"
              value={store.name}
              onChange={handleInputChange}
              required
            />
            
            <TextField
              fullWidth
              label="Store Area"
              name="area"
              value={store.area}
              onChange={handleInputChange}
              required
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate('/stores')}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Store'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default AddStore;
