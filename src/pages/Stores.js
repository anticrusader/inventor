import React from 'react';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const storesData = [
  {
    id: 'Store 1',
    area: 'East Center',
    price: '$5.00 - $11.00',
    category: 'Home, Office',
    status: 'Active',
  },
  {
    id: 'Store 2',
    area: 'West Center',
    price: '$10.00 - $15.00',
    category: "Women's Fashion",
    status: 'Inactive',
  },
  {
    id: 'Store 3',
    area: 'East Center',
    price: '$4.00 - $7.00',
    category: 'Books',
    status: 'Active',
  },
  {
    id: 'Store 4',
    area: 'Livingston',
    price: '$16.00 - $19.00',
    category: 'Mobiles, Computers',
    status: 'Inactive',
  },
  {
    id: 'Store 5',
    area: 'Bathgate',
    price: '$10.00 - $21.00',
    category: "Men's Fashion",
    status: 'Active',
  },
  {
    id: 'Store 6',
    area: 'Livingston',
    price: '$10.00 - $20.00',
    category: 'Mobile Recharges',
    status: 'Active',
  },
  {
    id: 'Store 7',
    area: 'Livingston',
    price: '$20.00 - $30.00',
    category: 'Car, Industrial',
    status: 'Inactive',
  },
  {
    id: 'Store 8',
    area: 'West Center',
    price: '$25.00 - $65.00',
    category: 'TV, Electronics',
    status: 'Active',
  },
  {
    id: 'Store 9',
    area: 'Livingston',
    price: '$3.00 - $6.00',
    category: 'Bags, Luggage',
    status: 'Inactive',
  },
];

const Stores = () => {
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
          startIcon={<img src="/add-icon.svg" alt="" />}
        >
          Add Stores
        </Button>
      </Box>

      {/* Search and Filter */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search"
          size="small"
          sx={{ width: 240 }}
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
          sx={{ px: 3 }}
        >
          Filter
        </Button>
      </Box>

      {/* Stores Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>Store Name</TableCell>
              <TableCell>Store Area</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {storesData.map((store) => (
              <TableRow key={store.id}>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>{store.id}</TableCell>
                <TableCell>{store.area}</TableCell>
                <TableCell>{store.price}</TableCell>
                <TableCell>{store.category}</TableCell>
                <TableCell>
                  <Typography
                    component="span"
                    sx={{
                      color: store.status === 'Active' ? 'primary.main' : 'text.secondary',
                      bgcolor: store.status === 'Active' ? 'primary.lighter' : 'action.hover',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.875rem',
                    }}
                  >
                    {store.status}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small">
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <DeleteOutlineOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          mt: 2,
          gap: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Total 50 items
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {[1, 2, 3, 4, 5].map((page) => (
            <Button
              key={page}
              variant={page === 1 ? 'contained' : 'outlined'}
              size="small"
              sx={{ minWidth: 'auto', width: 32, height: 32, p: 0 }}
            >
              {page}
            </Button>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default Stores;
