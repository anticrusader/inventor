import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Checkbox,
  InputAdornment,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Stores = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editStore, setEditStore] = useState(null);
  const [deleteStore, setDeleteStore] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await api.getStores();
      setStores(response || []);
    } catch (error) {
      console.error('Error fetching stores:', error);
      setError('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditClick = (store) => {
    setEditStore({ ...store });
  };

  const handleEditClose = () => {
    setEditStore(null);
  };

  const handleEditSave = async () => {
    try {
      setEditLoading(true);
      await api.updateStore(editStore._id, editStore);
      await fetchStores();
      setEditStore(null);
    } catch (error) {
      console.error('Error updating store:', error);
      alert('Failed to update store. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditStore(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeleteClick = (store) => {
    setDeleteStore(store);
  };

  const handleDeleteClose = () => {
    setDeleteStore(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.deleteStore(deleteStore._id);
      await fetchStores();
      setDeleteStore(null);
    } catch (error) {
      console.error('Error deleting store:', error);
      alert('Failed to delete store. Please try again.');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Stores
        </Typography>
        <Button
          variant="contained"
          sx={{ px: 3 }}
          onClick={() => navigate('/add-store')}
        >
          Add Store
        </Button>
      </Box>

      {/* Search and Filter */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search stores..."
          value={searchQuery}
          onChange={handleSearch}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterAltOutlinedIcon />}
        >
          Filter
        </Button>
      </Box>

      {/* Stores Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ textAlign: 'center', my: 4 }}>
          {error}
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>Store Name</TableCell>
                <TableCell>Store Area</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStores.map((store) => (
                <TableRow key={store._id}>
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell>{store.name}</TableCell>
                  <TableCell>{store.area}</TableCell>
                  <TableCell>
                    <Chip 
                      label={store.status} 
                      color={store.status === 'active' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(store)}>
                      <EditOutlinedIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(store)}>
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredStores.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                    No stores found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Store Dialog */}
      <Dialog open={!!editStore} onClose={handleEditClose}>
        <DialogTitle>Edit Store</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Store Name"
              name="name"
              value={editStore?.name || ''}
              onChange={handleEditChange}
              required
            />
            <TextField
              fullWidth
              label="Store Area"
              name="area"
              value={editStore?.area || ''}
              onChange={handleEditChange}
              required
            />
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={editStore?.status || 'active'}
              onChange={handleEditChange}
              SelectProps={{
                native: true
              }}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button 
            onClick={handleEditSave} 
            variant="contained" 
            disabled={editLoading}
          >
            {editLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteStore} onClose={handleDeleteClose}>
        <DialogTitle>Delete Store</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the store "{deleteStore?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Stores;
