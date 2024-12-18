import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  IconButton,
  TextField,
  Box,
  Chip,
  Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';

const productStats = [
  { title: 'Total Products', count: '25,430', change: '+15% Since last week' },
  { title: 'New Products', count: '20,120', change: '+12% Since last week' },
  { title: 'Deactive Products', count: '15,650', change: '+13% Since last week' },
  { title: 'Empty Products', count: '10,340', change: '+15% Since last week' },
];

const productsList = [
  { id: 1, sku: 'T-Shirt', name: 'T-shirt-blue-small', category: 'T-Shirt', price: '$150', qty: 20, store: 'Store 1', availability: 'Active' },
  { id: 2, sku: 'T-Shirt', name: 'T-shirt-blue-small', category: 'T-Shirt', price: '$150', qty: 20, store: 'Store 2', availability: 'Deactive' },
  { id: 3, sku: 'T-Shirt', name: 'T-shirt-blue-small', category: 'T-Shirt', price: '$150', qty: 20, store: 'Store 3', availability: 'Active' },
  { id: 4, sku: 'T-Shirt', name: 'T-shirt-blue-small', category: 'T-Shirt', price: '$150', qty: 20, store: 'Store 4', availability: 'Active' },
  { id: 5, sku: 'T-Shirt', name: 'T-shirt-blue-small', category: 'T-Shirt', price: '$150', qty: 20, store: 'Store 5', availability: 'Deactive' },
  { id: 6, sku: 'T-Shirt', name: 'T-shirt-blue-small', category: 'T-Shirt', price: '$150', qty: 20, store: 'Store 6', availability: 'Deactive' },
  { id: 7, sku: 'T-Shirt', name: 'T-shirt-blue-small', category: 'T-Shirt', price: '$150', qty: 20, store: 'Store 7', availability: 'Active' },
  { id: 8, sku: 'T-Shirt', name: 'T-shirt-blue-small', category: 'T-Shirt', price: '$150', qty: 20, store: 'Store 8', availability: 'Deactive' },
  { id: 9, sku: 'T-Shirt', name: 'T-shirt-blue-small', category: 'T-Shirt', price: '$150', qty: 20, store: 'Store 9', availability: 'Active' },
];

const Products = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Products</Typography>
        <Button
          variant="contained"
          startIcon={<ArrowForwardIcon />}
          sx={{ borderRadius: '8px' }}
          onClick={() => navigate('/products/add')}
        >
          Add Products
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {productStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', borderRadius: '12px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  {stat.title}
                </Typography>
                <ArrowForwardIcon fontSize="small" />
              </Box>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {stat.count}
              </Typography>
              <Typography variant="body2" color="success.main">
                {stat.change}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Products List Section */}
      <Paper sx={{ p: 2, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Typography variant="h6">Products list</Typography>
            <Chip label="All" variant="outlined" />
            <Chip label="Active" variant="outlined" />
            <Chip label="Sold" variant="outlined" />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search"
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
            >
              Filter
            </Button>
          </Box>
        </Box>

        {/* Products Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>Image</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Store</TableCell>
                <TableCell>Availability</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productsList.map((product) => (
                <TableRow key={product.id}>
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: 'grey.200',
                        borderRadius: 1
                      }}
                    />
                  </TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.qty}</TableCell>
                  <TableCell>{product.store}</TableCell>
                  <TableCell>
                    <Chip
                      label={product.availability}
                      color={product.availability === 'Active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Show 50 items
          </Typography>
          <Pagination count={6} shape="rounded" />
        </Box>
      </Paper>
    </Container>
  );
};

export default Products;
