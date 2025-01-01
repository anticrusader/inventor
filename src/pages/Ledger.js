// src/pages/Ledger.js
import React, { useState, useEffect, useCallback } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { TablePagination } from '@mui/material';
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
  message,
} from '@mui/material';
import api from '../services/api';


const Ledger = () => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [entries, setEntries] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [editDialog, setEditDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [transformedView, setTransformedView] = useState(false);
const [transformedData, setTransformedData] = useState([]);
const [nameFilter, setNameFilter] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);

  const calculateTotal = (entries) => {
    return entries.reduce((sum, entry) => sum + Number(entry.amount), 0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Filter function for both views
const getFilteredData = useCallback(() => {
  let filteredData = transformedView ? transformedData : entries;
  
  if (!filteredData) return [];

  // Name filter
  if (nameFilter) {
    if (transformedView) {
      // For transformed view, filter if any column containing the name exists
      filteredData = filteredData.filter(row => {
        return Object.keys(row).some(key => 
          key !== 'date' && 
          key.toLowerCase().includes(nameFilter.toLowerCase())
        );
      });
    } else {
      // For regular view
      filteredData = filteredData.filter(entry =>
        entry.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
  }

  // Date range filter
  // Date range filter
if (startDate || endDate) {
  filteredData = filteredData.filter(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);

    if (startDate && endDate) {
      // Date range filtering
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      return entryDate >= start && entryDate <= end;
    } else if (endDate) {
      // Single end date filtering
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      return entryDate.toDateString() === end.toDateString();
    } else if (startDate) {
      // Single start date filtering
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      return entryDate.toDateString() === start.toDateString();
    }
    return true;
  });
}

  return filteredData;
}, [entries, transformedData, transformedView, nameFilter, startDate, endDate]);

const calculateFilteredTotal = useCallback(() => {
  const filteredData = getFilteredData();
  
  if (transformedView) {
    // For transformed view, sum all numeric values in the filtered data
    return filteredData.reduce((total, row) => {
      let rowTotal = 0;
      Object.entries(row).forEach(([key, value]) => {
        if (key !== 'date' && typeof value === 'number') {
          rowTotal += value;
        }
      });
      return total + rowTotal;
    }, 0);
  } else {
    // For normal view
    return filteredData.reduce((sum, entry) => sum + Number(entry.amount), 0);
  }
}, [getFilteredData]);

const transformData = useCallback(() => {
  const filteredData = getFilteredData(); // Use filtered data instead of entries
  
  if (!filteredData || !Array.isArray(filteredData)) return [];  // Return empty array instead of undefined

  // Declare dateGroups object
  const dateGroups = {};
  const uniqueNames = new Set();
  const nameMapping = {}; // To preserve original name casing
  
  filteredData.forEach(entry => {
    if (!entry || !entry.date || !entry.name || !entry.amount) return;
    const date = new Date(entry.date).toLocaleDateString();
    const normalizedName = entry.name.toLowerCase().trim(); // Normalize the name
    
    // Store original name casing
    if (!nameMapping[normalizedName]) {
      nameMapping[normalizedName] = entry.name;
    }
    
    if (!dateGroups[date]) {
      dateGroups[date] = {};
    }
    
    uniqueNames.add(normalizedName);
    
    // Add amounts for same name on same date
    if (dateGroups[date][normalizedName]) {
      dateGroups[date][normalizedName] += Number(entry.amount) || 0;
    } else {
      dateGroups[date][normalizedName] = Number(entry.amount) || 0;
    }
  });
// Only proceed if we have data to transform
if (Object.keys(dateGroups).length === 0) return [];
  // Create transformed data structure
  return Object.keys(dateGroups)
    .sort((a, b) => new Date(b) - new Date(a))
    .map(date => {
      const row = { date };
      Array.from(uniqueNames).forEach(normalizedName => {
        const originalName = nameMapping[normalizedName];
        row[originalName] = dateGroups[date][normalizedName] || 0;
      });
      return row;
    });
}, [getFilteredData]);
  // First useEffect for fetching entries (only on mount)
useEffect(() => {
  fetchEntries();
}, []); // Empty dependency array means it only runs once on mount

// Second useEffect for updating total and transformed data
useEffect(() => {
  const newTotal = calculateFilteredTotal();
  setTotalAmount(newTotal);
  
  if (transformedView) {
    const transformedResult = transformData();
    setTransformedData(transformedResult);
  }
}, [nameFilter, startDate, endDate, calculateFilteredTotal, transformedView, transformData]);

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
  
  const handleTransformView = useCallback(() => {
    if (!transformedView) {
      // Create transformed view
      const dateGroups = {};
      const uniqueNames = new Set();
  
      // First pass: collect all unique names and group by date
      entries.forEach(entry => {
        const date = new Date(entry.date).toLocaleDateString();
        const name = entry.name;
        
        if (!dateGroups[date]) dateGroups[date] = {};
        if (!dateGroups[date][name]) dateGroups[date][name] = 0;
        
        dateGroups[date][name] += Number(entry.amount);
        uniqueNames.add(name);
      });
  
      // Convert to array format
      const transformed = Object.keys(dateGroups).map(date => {
        const row = { date };
        Array.from(uniqueNames).forEach(name => {
          row[name] = dateGroups[date][name] || null;
        });
        return row;
      });
  
      // Sort by date
      transformed.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      setTransformedData(transformed);
    }
    
    setTransformedView(prev => !prev);
  }, [entries]);
  const exportToCSV = () => {
    const filteredData = getFilteredData();
    const csvData = transformedView ? transformData() : filteredData;
    
    let csvContent = '';
    
    if (transformedView) {
      // Get all unique names for columns
      const names = new Set();
      csvData.forEach(row => {
        Object.keys(row).forEach(key => {
          if (key !== 'date') names.add(key);
        });
      });
      
      // Create header
      const headers = ['Date', ...Array.from(names)];
      csvContent = headers.join(',') + '\n';
      
      // Add data rows
      csvData.forEach(row => {
        const rowData = [
          row.date,
          ...Array.from(names).map(name => row[name] || '0')
        ];
        csvContent += rowData.join(',') + '\n';
      });
    } else {
      // Normal view export
      const headers = ['Name', 'Amount', 'Date'];
      csvContent = headers.join(',') + '\n';
      
      filteredData.forEach(entry => {
        const row = [
          entry.name,
          entry.amount,
          new Date(entry.date).toLocaleDateString()
        ];
        csvContent += row.join(',') + '\n';
      });
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'ledger_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const fetchEntries = async () => {
    try {
      let url = '/ledger';
      const params = new URLSearchParams();
     // if (filterName) params.append('name', filterName);
      //if (filterDate) params.append('date', filterDate);
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await api.getLedgerEntries();
      // Make sure we're setting the data from response.data
      setEntries(response.data || []); // Add fallback empty array
      //setTotalAmount(calculateTotal(response.data || []));
    } catch (error) {
      console.error('Error fetching entries:', error);
      setEntries([]); // Set empty array on error
    }
  };
  
  
  // Then update the useEffect:
  useEffect(() => {
    fetchEntries();
  }, []); // Empty dependency array means it only runs once on mount
  
  useEffect(() => {
    const newTotal = calculateFilteredTotal();
    setTotalAmount(newTotal);
    
    if (transformedView) {
      handleTransformView();
      //const transformedResult = transformData();
      //if (transformedResult && transformedResult.length >= 0) {
        //setTransformedData(transformedResult);
      //}
    }
  }, [nameFilter, startDate, endDate, calculateFilteredTotal, transformedView, transformData,handleTransformView]);


// Get paginated data
const getPaginatedData = () => {
  const filteredData = getFilteredData();
  return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
};
const getColumns = () => {
  if (!transformedView) {
    return [
      { field: 'name', headerName: 'Name', flex: 1 },
      { field: 'amount', headerName: 'Amount', flex: 1 },
      { field: 'date', headerName: 'Date', flex: 1 },
      { field: 'actions', headerName: 'Actions', flex: 1 }
    ];
  }

  if (!entries || !Array.isArray(entries)) return [];

  // Create date column first
  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      width: 150, // Fixed width instead of flex
      fixed: 'left'
    }
  ];

  // Get unique names with case-insensitive comparison
  const uniqueNormalizedNames = new Set(
    entries.map(item => item.name.toLowerCase().trim())
  );

  // Use the first occurrence's casing for display
  const nameMapping = {};
  entries.forEach(entry => {
    const normalizedName = entry.name.toLowerCase().trim();
    if (!nameMapping[normalizedName]) {
      nameMapping[normalizedName] = entry.name;
    }
  });

  // Create columns using the first occurrence's casing
  Array.from(uniqueNormalizedNames).forEach(normalizedName => {
    columns.push({
      field: nameMapping[normalizedName],
      headerName: nameMapping[normalizedName],
      width: 200, // Fixed width instead of flex
      renderCell: (params) => params.value ? `Rs ${Number(params.value).toFixed(2)}` : '-'
    });
  });

  return columns;
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
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Filter by Name"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={startDate || ''}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={endDate || ''}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: 'flex', gap: 2 }}>
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
                <Button
                  variant="contained"
                  onClick={handleTransformView}
                  sx={{
                    backgroundColor: '#FF9900',
                    '&:hover': { backgroundColor: '#FF8C00' }
                  }}
                >
                  {transformedView ? 'Normal View' : 'Transform View'}
                </Button>
              </Grid>
            </Grid>

            <TableContainer sx={{ 
              maxWidth: '100%', 
              overflowX: 'auto',
              '& .MuiTable-root': {
                width: 'max-content',
                minWidth: '100%',
              }
            }}>
              <Table 
                stickyHeader 
                sx={{
                  tableLayout: 'fixed',
                  '& th, & td': {
                    minWidth: '200px',
                    width: '200px',
                    boxSizing: 'border-box',
                    whiteSpace: 'nowrap'
                  },
                  '& th:first-of-type, & td:first-of-type': {
                    position: 'sticky',
                    left: 0,
                    zIndex: 1,
                    minWidth: '150px',
                    width: '150px',
                    backgroundColor: '#1A1F2D'
                  }
                }}
              >
                <TableHead>
                  <TableRow>
                    {transformedView ? (
                      <>
                        <TableCell sx={{ color: 'white', backgroundColor: '#1A1F2D' }}>Date</TableCell>
                        {Object.keys(transformedData[0] || {}).map(key => 
                          key !== 'date' && (
                            <TableCell key={key} sx={{ color: 'white', backgroundColor: '#1A1F2D' }}>
                              {key}
                            </TableCell>
                          )
                        )}
                      </>
                    ) : (
                      <>
                        <TableCell sx={{ color: 'white' }}>Name</TableCell>
                        <TableCell sx={{ color: 'white' }}>Amount</TableCell>
                        <TableCell sx={{ color: 'white' }}>Date</TableCell>
                        <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transformedView ? (
                    transformedData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ 
                          color: 'white',
                          backgroundColor: '#1A1F2D'
                        }}>
                          {row.date}
                        </TableCell>
                        {Object.keys(row).map(key => 
                          key !== 'date' && (
                            <TableCell key={key} sx={{ color: 'white' }}>
                              {row[key] !== null ? `Rs ${Number(row[key]).toFixed(2)}` : 'Rs 0.00'}
                            </TableCell>
                          )
                        )}
                      </TableRow>
                    ))
                  ) : (
                    getPaginatedData().map((entry) => (
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
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              component="div"
              count={getFilteredData().length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[10]}
              sx={{ 
                color: 'white',
                marginTop: 2
              }}
            />
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