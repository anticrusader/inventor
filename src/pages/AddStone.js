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

const AddStone = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Stone name is required');
      return;
    }

    try {
      await api.addStone({ name: name.trim() });
      setOpenSnackbar(true);
      // Clear form
      setName('');
      setTimeout(() => {
        navigate('/stones');
      }, 2000);
    } catch (err) {
      console.error('Error adding stone:', err);
      setError(err.response?.data?.message || 'Error adding stone');
    }
  };

  const handleCancel = () => {
    navigate('/stones');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Add New Stone
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Stone Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            required
            error={!!error}
            helperText={error}
            sx={{ mb: 3 }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!name.trim()}
            >
              Add Stone
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
          Stone added successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddStone;
