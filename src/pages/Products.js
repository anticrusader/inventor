import React, { useState, useMemo, useEffect } from 'react';
import api from '../services/api';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate, useLocation } from 'react-router-dom';

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [outOfStock, setOutOfStock] = useState(false);
  const rowsPerPage = 10;

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, [location.state?.refresh]); // Re-fetch when refresh flag changes

  /**
   * Fetches products from the API and updates the local state.
   * If location state contains a refresh flag, it is cleared after fetching.
   */
  const fetchProducts = async () => {
    try {
      // Set loading state to true
      setLoading(true);
      // Make API call to fetch products
      const response = await api.getProducts();
      console.log('Fetched products:', response.data);
      // Update local state with the fetched products
      setProducts(response.data);
      // Clear any error messages
      setError(null);
      // If location state contains a refresh flag, remove it
      if (location.state?.refresh) {
        navigate(location.pathname, { replace: true });
      }
    } catch (err) {
      // If there is an error, log it and set an error message in state
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
    } finally {
      // Set loading state to false, regardless of success or error
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    navigate(`/edit-product/${product._id}`);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        await api.deleteProduct(productId);
        // Remove the product from local state
        setProducts(prevProducts => prevProducts.filter(p => p._id !== productId));
        // Clear any selected items that were deleted
        setSelected(prevSelected => prevSelected.filter(id => id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
        // Refresh the products list to ensure consistency
        fetchProducts();
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (window.confirm(`Are you sure you want to delete ${selected.length} products?`)) {
      try {
        setLoading(true);
        await Promise.all(selected.map(id => api.deleteProduct(id)));
        // Remove deleted products from local state
        setProducts(prevProducts => prevProducts.filter(p => !selected.includes(p._id)));
        // Clear selected items
        setSelected([]);
      } catch (error) {
        console.error('Error deleting products:', error);
        alert('Failed to delete some products. Please try again.');
        // Refresh the products list to ensure consistency
        fetchProducts();
      } finally {
        setLoading(false);
      }
    }
  };

  // Filter and search products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      let matchesStatus = true;
      if (filterStatus !== 'all') {
        matchesStatus = product.status.toLowerCase() === filterStatus;
      }
      
      // Type filter
      let matchesType = true;
      if (filterType === 'total') {
        matchesType = true;
      } else if (filterType === 'active') {
        matchesType = product.status.toLowerCase() === 'active';
      } else if (filterType === 'inactive') {
        matchesType = product.status.toLowerCase() === 'inactive';
      } else if (outOfStock) {
        matchesType = product.quantity === 0;
      }
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [products, searchQuery, filterStatus, filterType, outOfStock]);

  // Calculate pagination
  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredProducts.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredProducts, page]);

  // Handle checkbox selection
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(paginatedProducts.map(product => product._id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (event, id) => {
    if (event.target.checked) {
      setSelected([...selected, id]);
    } else {
      setSelected(selected.filter(selectedId => selectedId !== id));
    }
  };

  // Stats Cards
  const stats = [
    {
      title: 'Total Products',
      count: products.length,
      change: '+2.5% Since last week',
      filterValue: 'total',
      activeColor: '#1976d2',
      inactiveColor: '#1a1f2d'
    },
    {
      title: 'Active Products',
      count: products.filter(p => p.status.toLowerCase() === 'active').length,
      change: '+3.2% Since last week',
      filterValue: 'active',
      activeColor: '#1976d2',
      inactiveColor: '#1a1f2d'
    },
    {
      title: 'Inactive Products',
      count: products.filter(p => p.status.toLowerCase() === 'inactive').length,
      change: '-0.8% Since last week',
      filterValue: 'inactive',
      activeColor: '#1976d2',
      inactiveColor: '#1a1f2d'
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight="bold">
          Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/add-product')}
        >
          Add Product
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                bgcolor: filterType === stat.filterValue ? stat.activeColor : stat.inactiveColor,
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
              onClick={() => {
                if (filterType === stat.filterValue) {
                  setFilterType(null);
                } else {
                  setFilterType(stat.filterValue);
                  setOutOfStock(false);
                }
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#fff' }}>
                {stat.title}
              </Typography>
              <Typography variant="h3" component="div" sx={{ flexGrow: 1, color: '#fff' }}>
                {stat.count}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: '#4caf50' }}>
                  {stat.change}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: outOfStock ? '#00e676' : '#1a1f2d',
              color: outOfStock ? '#000' : '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 3
              }
            }}
            onClick={() => {
              setOutOfStock(!outOfStock);
              setFilterType(null);
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Out of Stock
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              {products.filter(p => p.quantity === 0).length}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: outOfStock ? '#000' : '#4caf50' }}>
                +1.5% Since last week
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Products list header with filters */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 3,
        borderBottom: 1,
        borderColor: 'divider',
        pb: 1
      }}>
        <Typography variant="h6" component="div" sx={{ mr: 3 }}>
          Products list
        </Typography>
        <Box sx={{ 
          display: 'flex',
          gap: 1,
          '& .MuiButton-root': {
            minWidth: 'auto',
            px: 2,
            py: 0.5,
            borderRadius: '20px',
            textTransform: 'none',
            fontSize: '0.875rem'
          }
        }}>
          <Button
            variant={filterStatus === 'all' ? 'contained' : 'outlined'}
            onClick={() => {
              setFilterStatus('all');
              setFilterType(null);
              setOutOfStock(false);
            }}
            color="primary"
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'active' ? 'contained' : 'outlined'}
            onClick={() => {
              setFilterStatus('active');
              setFilterType(null);
              setOutOfStock(false);
            }}
            color="primary"
          >
            Active
          </Button>
          <Button
            variant={filterStatus === 'inactive' ? 'contained' : 'outlined'}
            onClick={() => {
              setFilterStatus('inactive');
              setFilterType(null);
              setOutOfStock(false);
            }}
            color="primary"
          >
            Inactive
          </Button>
        </Box>
      </Box>

      {/* Search and other controls */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
          }}
        />
      </Box>

      {/* Products Table */}
      {loading ? (
        <Typography>Loading products...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.length === paginatedProducts.length}
                      indeterminate={selected.length > 0 && selected.length < paginatedProducts.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProducts.map((product) => (
                  <TableRow
                    key={product._id}
                    hover
                    role="checkbox"
                    tabIndex={-1}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={selected.includes(product._id)}
                        onChange={(event) => handleSelectOne(event, product._id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {product.images && product.images[0] && (
                          <Box
                            component="img"
                            src={`${process.env.REACT_APP_API_URL}/uploads/products/${product.images[0].replace(/0{0,1}(\d{13})-/, '$1-')}`}
                            alt={product.name}
                            sx={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 1 }}
                            onError={(e) => {
                              console.error('Error loading image:', e);
                              e.target.src = 'https://via.placeholder.com/40';
                            }}
                          />
                        )}
                        <Box>
                          <Typography variant="subtitle2">{product.name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {product.description}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <Chip 
                        label={product.status} 
                        color={product.status.toLowerCase() === 'active' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(product)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(product._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={Math.ceil(filteredProducts.length / rowsPerPage)}
              page={page}
              onChange={(e, newPage) => setPage(newPage)}
            />
          </Box>
          {selected.length > 0 && (
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteSelected}
              sx={{ mt: 2 }}
            >
              Delete selected ({selected.length})
            </Button>
          )}
        </>
      )}
    </Container>
  );
};

export default Products;
