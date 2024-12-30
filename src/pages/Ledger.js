// src/pages/Ledger.js
import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import api from '../services/api';

const Ledger = () => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [entries, setEntries] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [editDialog, setEditDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const calculateTotal = (entries) => {
    return entries.reduce((sum, entry) => sum + Number(entry.amount), 0);
  };

  const fetchEntries = async () => {
    try {
      let url = '/ledger';
      const params = new URLSearchParams();
      if (filterName) params.append('name', filterName);
      if (filterDate) params.append('date', filterDate);
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await api.getLedgerEntries(params);
      setEntries(response);
      setTotalAmount(calculateTotal(response));
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [filterName, filterDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.addLedgerEntry(formData);
      setFormData({ 
        name: '', 
        amount: '', 
        date: new Date().toISOString().split('T')[0] 
      });
      fetchEntries();
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Amount', 'Date'],
      ...entries.map(entry => [
        entry.name,
        entry.amount,
        new Date(entry.date).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ledger.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };
  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setEditDialog(true);
  };
  
  const handleUpdate = async () => {
    try {
      // Make sure we're sending the correct data format
      const updateData = {
        name: editingEntry.name,
        amount: Number(editingEntry.amount),
        date: editingEntry.date
      };
      
      console.log('Updating entry:', editingEntry._id, updateData); // Debug log
      
      await api.updateLedgerEntry(editingEntry._id, updateData);
      setEditDialog(false);
      setEditingEntry(null);
      await fetchEntries(); // Refresh the list
    } catch (error) {
      console.error('Error updating entry:', error.response?.data || error.message);
      alert('Failed to update entry. Please try again.');
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        console.log('Deleting entry:', id); // Debug log
        
        await api.deleteLedgerEntry(id);
        await fetchEntries(); // Refresh the list
      } catch (error) {
        console.error('Error deleting entry:', error.response?.data || error.message);
        alert('Failed to delete entry. Please try again.');
      }
    }
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, backgroundColor: '#1A1F2D' }}>
              <Typography variant="h5" sx={{ mb: 3, color: 'white' }}>
                Add Ledger Entry
              </Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  sx={{ mb: 2 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 2,
                    backgroundColor: '#FF9900',
                    '&:hover': { backgroundColor: '#FF8C00' }
                  }}
                >
                  Add Entry
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, backgroundColor: '#1A1F2D' }}>
              <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Grid item>
                  <Typography variant="h5" sx={{ color: 'white' }}>
                    Ledger Entries
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h6" sx={{ color: '#FF9900' }}>
                    Total Amount: Rs {totalAmount.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Filter by Name"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Filter by Date"
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    variant="contained"
                    onClick={exportToCSV}
                    sx={{
                      backgroundColor: '#FF9900',
                      '&:hover': { backgroundColor: '#FF8C00' }
                    }}
                  >
                    Export to CSV
                  </Button>
                </Grid>
              </Grid>

              <TableContainer>
                <Table>
                <TableHead>
  <TableRow>
    <TableCell sx={{ color: 'white' }}>Name</TableCell>
    <TableCell sx={{ color: 'white' }}>Amount</TableCell>
    <TableCell sx={{ color: 'white' }}>Date</TableCell>
    <TableCell sx={{ color: 'white' }}>Actions</TableCell>
  </TableRow>
</TableHead>
<TableBody>
  {entries.map((entry) => (
    <TableRow key={entry._id}>
      <TableCell sx={{ color: 'white' }}>{entry.name}</TableCell>
      <TableCell sx={{ color: 'white' }}>Rs {Number(entry.amount).toFixed(2)}</TableCell>
      <TableCell sx={{ color: 'white' }}>
        {new Date(entry.date).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <IconButton 
          onClick={() => handleEdit(entry)}
          sx={{ color: '#FF9900', mr: 1 }}
        >
          <EditIcon />
        </IconButton>
        <IconButton 
          onClick={() => handleDelete(entry._id)}
          sx={{ color: '#FF9900' }}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  ))}
</TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
  <DialogTitle>Edit Ledger Entry</DialogTitle>
  <DialogContent>
    <TextField
      fullWidth
      label="Name"
      value={editingEntry?.name || ''}
      onChange={(e) => setEditingEntry({ ...editingEntry, name: e.target.value })}
      sx={{ mt: 2, mb: 2 }}
    />
    <TextField
      fullWidth
      label="Amount"
      type="number"
      value={editingEntry?.amount || ''}
      onChange={(e) => setEditingEntry({ ...editingEntry, amount: e.target.value })}
      sx={{ mb: 2 }}
    />
    <TextField
      fullWidth
      label="Date"
      type="date"
      value={editingEntry?.date?.split('T')[0] || ''}
      onChange={(e) => setEditingEntry({ ...editingEntry, date: e.target.value })}
      InputLabelProps={{
        shrink: true,
      }}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setEditDialog(false)}>Cancel</Button>
    <Button 
      onClick={handleUpdate} 
      variant="contained" 
      sx={{ 
        backgroundColor: '#FF9900',
        '&:hover': { backgroundColor: '#FF8C00' }
      }}
    >
      Update
    </Button>
  </DialogActions>
</Dialog>
    </>
  );
};

export default Ledger;