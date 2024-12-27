import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
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
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  ImageList,
  ImageListItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate, useLocation } from 'react-router-dom';
import ZoomableImage from '../components/ZoomableImage';

const defaultProductImage = 'https://via.placeholder.com/40';

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [outOfStock, setOutOfStock] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loadingCategories, setLoadingCategories] = useState(true);
  const rowsPerPage = 10;

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, [location.state?.refresh]); // Re-fetch when refresh flag changes

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await axios.get('https://inventor-dv3d.onrender.com/api/categories');
        if (response.data) {
          setCategories(response.data || []);
        } else {
          console.error('Error fetching categories:', response.message);
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);
  /**
   * Fetches products from the API and updates the local state.
   * If location state contains a refresh flag, it is cleared after fetching.
   */
  const fetchProducts = async () => {
    try {
      // Set loading state to true
      setLoading(true);
      // Make API call to fetch products
      const response = await axios.get('https://inventor-dv3d.onrender.com/api/products');
      console.log('Fetched products:', response);
      // Update local state with the fetched products
      if (response.data) {
        setProducts(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch products');
        setProducts([]);
      }
      // Clear any error messages if successful
      setError(null);
      // If location state contains a refresh flag, remove it
      if (location.state?.refresh) {
        navigate(location.pathname, { replace: true });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message || 'Error loading products');
      setProducts([]);
    } finally {
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
        await axios.delete(`https://inventor-dv3d.onrender.com/api/products/${productId}`);
        // Remove the product from local state
        setProducts(prevProducts => prevProducts.filter(p => p._id !== productId));
        // Clear any selected items that were deleted
        setSelectedProducts(prevSelected => prevSelected.filter(id => id !== productId));
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
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      try {
        setLoading(true);
        await Promise.all(selectedProducts.map(id => axios.delete(`https://inventor-dv3d.onrender.com/api/products/${id}`)));
        // Remove deleted products from local state
        setProducts(prevProducts => prevProducts.filter(p => !selectedProducts.includes(p._id)));
        // Clear selected items
        setSelectedProducts([]);
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

  const handleViewImages = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseImages = () => {
    setSelectedProduct(null);
  };
  // Filter and search products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      // Out of stock filter
      let matchesType = true;
      if (outOfStock) {
        matchesType = product.quantity === 0;
      }
      
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [products, searchQuery, selectedCategory, outOfStock]);

  // Calculate pagination
  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredProducts.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredProducts, page]);

  // Calculate totals for filtered products
  const totals = useMemo(() => {
    return filteredProducts.reduce((acc, product) => {
      acc.quantity += product.quantity;
      acc.price += product.price * product.quantity;
      return acc;
    }, { quantity: 0, price: 0 });
  }, [filteredProducts]);

  // Handle checkbox selection
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedProducts(paginatedProducts.map(product => product._id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (event, id) => {
    if (event.target.checked) {
      setSelectedProducts([...selectedProducts, id]);
    } else {
      setSelectedProducts(selectedProducts.filter(selectedId => selectedId !== id));
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
          overflowX: 'auto',
          '& .MuiButton-root': {
            minWidth: 'auto',
            px: 2,
            py: 0.5,
            borderRadius: '20px',
            textTransform: 'none',
            fontSize: '0.875rem',
            whiteSpace: 'nowrap'
          }
        }}>
          <Button
            variant={selectedCategory === 'all' ? 'contained' : 'outlined'}
            onClick={() => {
              setSelectedCategory('all');
              setFilterType(null);
              setOutOfStock(false);
            }}
            color="primary"
          >
            All
          </Button>
          {Array.isArray(categories) && categories.map((category) => (
            <Button
              key={category._id}
              variant={selectedCategory === category.name ? 'contained' : 'outlined'}
              onClick={() => {
                setSelectedCategory(category.name);
                setFilterType(null);
                setOutOfStock(false);
              }}
              color="primary"
            >
              {category.name}
            </Button>
          ))}
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
                      indeterminate={selectedProducts.length > 0 && selectedProducts.length < paginatedProducts.length}
                      checked={paginatedProducts.length > 0 && selectedProducts.length === paginatedProducts.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Weight</TableCell>
                  <TableCell>Stone</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProducts.map((product) => (
                  <TableRow
                    key={product._id}
                    hover
                    role="checkbox"
                    selected={selectedProducts.includes(product._id)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedProducts.includes(product._id)}
                        onChange={(event) => handleSelectProduct(event, product._id)}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={`${process.env.REACT_APP_API_URL}/uploads/products/${product.images[0]}`}
                            alt={product.name}
                            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '4px' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = defaultProductImage;
                            }}
                          />
                        ) : (
                          <img
                            src={defaultProductImage}
                            alt="Default"
                            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '4px' }}
                          />
                        )}
                        <Box>
                          <Typography variant="subtitle2">{product.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {product.sku}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">Rs. {product.price}</TableCell>
                    <TableCell align="right">{product.quantity}</TableCell>
                    <TableCell align="right">{product.weight}</TableCell>
                    <TableCell>{product.stone?.name || '-'}</TableCell>
                    <TableCell>
                      {product.vendor ? `${product.vendor.fname} ${product.vendor.lname || ''}`.trim() : '-'}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleViewImages(product)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => handleEdit(product)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(product._id)}>
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

          {selectedProducts.length > 0 && (
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteSelected}
              sx={{ mt: 2 }}
            >
              Delete selected ({selectedProducts.length})
            </Button>
          )}
        </>
      )}
      <Dialog 
        open={!!selectedProduct} 
        onClose={handleCloseImages}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Product Images - {selectedProduct?.name}
        </DialogTitle>
        <DialogContent>
          {selectedProduct?.images?.length > 0 ? (
            <ImageList cols={3} gap={8}>
              {selectedProduct.images.map((image, index) => (
                <ImageListItem key={index}>
                  <ZoomableImage
                    src={`${process.env.REACT_APP_API_URL}/uploads/products/${image}`}
                    alt={`Product ${index + 1}`}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          ) : (
            <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
              No images available for this product
            </Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* Summary Stats */}
      {selectedCategory !== 'all' && (
        <Paper sx={{ mt: 2, p: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6">Total Quantity ({selectedCategory})</Typography>
            <Typography variant="h4">
              {filteredProducts.reduce((sum, product) => sum + product.quantity, 0)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6">Total Weight ({selectedCategory})</Typography>
            <Typography variant="h4">
              {filteredProducts.reduce((sum, product) => sum + (product.weight || 0), 0).toFixed(2)} g
            </Typography>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default Products;
