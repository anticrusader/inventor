import React, { useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  TextField,
  InputAdornment,
  Grid,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import AddIcon from '@mui/icons-material/Add';

// Sample data for attributes
const sampleAttributes = [
  { id: 1, name: 'Ronald', totalValue: '04', status: 'Active' },
  { id: 2, name: 'Max', totalValue: '06', status: 'Deactive' },
  { id: 3, name: 'Shawn', totalValue: '02', status: 'Active' },
  { id: 4, name: 'Ann', totalValue: '09', status: 'Active' },
  { id: 5, name: 'Courtney', totalValue: '05', status: 'Active' },
  { id: 6, name: 'Cameron', totalValue: '07', status: 'Deactive' },
  { id: 7, name: 'Gladys', totalValue: '08', status: 'Active' },
  { id: 8, name: 'Philip', totalValue: '10', status: 'Active' },
];

// Sample data for attribute values
const sampleAttributeValues = [
  { id: 1, name: 'Ronald', status: 'Active' },
  { id: 2, name: 'Max', status: 'Deactive' },
  { id: 3, name: 'Shawn', status: 'Active' },
  { id: 4, name: 'Ann', status: 'Active' },
  { id: 5, name: 'Courtney', status: 'Active' },
  { id: 6, name: 'Cameron', status: 'Deactive' },
  { id: 7, name: 'Gladys', status: 'Active' },
];

const Attributes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);

  const handleSelectAllAttributes = (event) => {
    if (event.target.checked) {
      setSelectedAttributes(sampleAttributes.map(attr => attr.id));
    } else {
      setSelectedAttributes([]);
    }
  };

  const handleSelectAttribute = (event, id) => {
    const selectedIndex = selectedAttributes.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedAttributes, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedAttributes.slice(1));
    } else if (selectedIndex === selectedAttributes.length - 1) {
      newSelected = newSelected.concat(selectedAttributes.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedAttributes.slice(0, selectedIndex),
        selectedAttributes.slice(selectedIndex + 1),
      );
    }

    setSelectedAttributes(newSelected);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1">Attributes</Typography>
        <Button
          variant="outlined"
          startIcon={<FilterAltOutlinedIcon />}
          sx={{ borderRadius: '8px' }}
        >
          Filter
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Left side - Attributes */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Search"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: '#f5f5f5',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedAttributes.length > 0 && selectedAttributes.length < sampleAttributes.length}
                      checked={selectedAttributes.length === sampleAttributes.length}
                      onChange={handleSelectAllAttributes}
                    />
                  </TableCell>
                  <TableCell>Attribute Name</TableCell>
                  <TableCell>Total Value</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sampleAttributes.map((attr) => (
                  <TableRow 
                    key={attr.id} 
                    hover
                    sx={attr.id === 1 ? { bgcolor: '#f5f5f5' } : {}}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedAttributes.indexOf(attr.id) !== -1}
                        onChange={(event) => handleSelectAttribute(event, attr.id)}
                      />
                    </TableCell>
                    <TableCell>{attr.name}</TableCell>
                    <TableCell>{attr.totalValue}</TableCell>
                    <TableCell>{attr.status}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Right side - Attribute Values */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Attribute Value</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ borderRadius: '8px' }}
            >
              Add Value
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell>Attribute Value</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sampleAttributeValues.map((value) => (
                  <TableRow key={value.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell>{value.name}</TableCell>
                    <TableCell>{value.status}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Attributes;
