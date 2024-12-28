import React, { useState, useEffect } from 'react';
import api from '../services/api';
import axios from 'axios';
import config from '../config';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  IconButton,
  Stack,
  Paper,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const editMode = searchParams.get('edit');
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [stones, setStones] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState(null);
  const [product, setProduct] = useState({
    name: '',
    price: '',
    sku: '',
    quantity: '',
    description: '',
    status: 'active',
    category: '',
    weight: '',
    stone: '',
    vendor: ''
  });
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, stonesResponse, vendorsResponse] = await Promise.all([
          axios.get(`${config.API_URL}/categories`),
          axios.get(`${config.API_URL}/stones`),
          axios.get(`${config.API_URL}/vendors`)
        ]);
        
        console.log('Categories Response:', categoriesResponse);
        console.log('Stones Response:', stonesResponse);
        console.log('Vendors Response:', vendorsResponse);
        setCategories(categoriesResponse.data);
        setStones(stonesResponse.data);
        setVendors(vendorsResponse.data);
        setError(null);
        // Set categories with proper error handling
        // if (categoriesResponse.success) {
        //   setCategories(categoriesResponse.data || []);
        // } else {
        //   console.error('Error loading categories:', categoriesResponse.message);
        //   setCategories([]);
        // }
        
        // // Set stones with proper error handling
        // if (stonesResponse.success) {
        //   setStones(stonesResponse.data || []);
        // } else {
        //   console.error('Error loading stones:', stonesResponse.message);
        //   setStones([]);
        // }
        
        // // Set vendors with proper error handling
        // if (vendorsResponse.success) {
        //   setVendors(vendorsResponse.data || []);
        // } else {
        //   console.error('Error loading vendors:', vendorsResponse.message);
        //   setVendors([]);
        // }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load required data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (editMode && location.state?.product) {
      const editProduct = location.state.product;
      setProduct({
        name: editProduct.name,
        price: editProduct.price,
        sku: editProduct.sku,
        quantity: editProduct.quantity,
        description: editProduct.description,
        status: editProduct.status.toLowerCase(),
        category: editProduct.category,
        weight: editProduct.weight,
        stone: editProduct.stone,
        vendor: editProduct.vendor
      });
      
      // Load existing images
      if (editProduct.images && editProduct.images.length > 0) {
        console.log('Loading existing images:', editProduct.images);
        setImages(editProduct.images.map(img => ({ url: img, name: img, isExisting: true })));
      }
    }
  }, [editMode, location.state]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const newImageFiles = [...files].filter(file => file.type.startsWith('image/'));
    const newImages = newImageFiles.map(file => ({
      url: URL.createObjectURL(file),
      file: file,
      name: file.name,
      isExisting: false
    }));
    
    setImageFiles(prev => [...prev, ...newImageFiles]);
    setImages(prev => [...prev, ...newImages]);
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    handleFiles(files);
  };

  const removeImage = (index) => {
    console.log('Removing image at index:', index);
    const imageToRemove = images[index];
    console.log('Image to remove:', imageToRemove);
    
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      console.log('Updated images:', newImages);
      return newImages;
    });
    
    // Only update imageFiles if it's a new image
    if (!imageToRemove.isExisting) {
      setImageFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      
      // Add all product fields
      Object.keys(product).forEach(key => {
        if (product[key]) {
          formData.append(key, product[key]);
        }
      });

      // Add images
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      await api.addProduct(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error.response?.data?.message || 'Error saving product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' || name === 'weight' ? Number(value) : value
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1">
          {editMode ? 'Edit Product' : 'Add Product'}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left side - Image Upload */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              bgcolor: dragActive ? 'action.hover' : '#1a1f2d',
              border: '2px dashed',
              borderColor: dragActive ? 'primary.main' : 'divider',
              borderRadius: 1,
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('image-upload').click()}
          >
            <input
              type="file"
              id="image-upload"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            {images.length > 0 ? (
              <Box sx={{ width: '100%', position: 'relative' }}>
                <Box
                  component="img"
                  src={images[0].url}
                  alt="Product"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 1,
                    display: 'block'
                  }}
                />
                <Typography variant="subtitle2" sx={{ mt: 1, color: '#fff', textAlign: 'center' }}>
                  Product 1
                </Typography>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(0);
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'background.paper',
                    '&:hover': {
                      bgcolor: 'background.paper'
                    }
                  }}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', color: '#fff' }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Upload Image
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Drag and drop or click to select
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right side - Product Details */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              required
            />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                  }}
                  value={product.price}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={product.quantity}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Weight"
                  name="weight"
                  type="number"
                  inputProps={{ step: "0.01" }}
                  value={product.weight}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Stone</InputLabel>
                  <Select
                    name="stone"
                    value={product.stone}
                    onChange={handleInputChange}
                    label="Stone"
                  >
                    {Array.isArray(stones) && stones.map((stone) => (
                      <MenuItem key={stone._id} value={stone._id}>
                        {stone.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Vendor</InputLabel>
                  <Select
                    name="vendor"
                    value={product.vendor}
                    onChange={handleInputChange}
                    label="Vendor"
                  >
                    {Array.isArray(vendors) && vendors.map((vendor) => (
                      <MenuItem key={vendor._id} value={vendor._id}>
                        {vendor.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={product.status}
                    onChange={handleInputChange}
                    label="Status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={product.category}
                    onChange={handleInputChange}
                    label="Category"
                    disabled={loadingCategories}
                  >
                    {loadingCategories ? (
                      <MenuItem value="" disabled>
                        Loading categories...
                      </MenuItem>
                    ) : categoryError ? (
                      <MenuItem value="" disabled>
                        {categoryError}
                      </MenuItem>
                    ) : categories && categories.length > 0 ? (
                      categories.map((category) => (
                        <MenuItem key={category._id} value={category.name}>
                          {category.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="" disabled>
                        No categories available
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="SKU"
                  name="sku"
                  value={product.sku || 'Will be generated automatically'}
                  InputProps={{
                    readOnly: true,
                  }}
                  disabled
                  helperText="SKU will be generated automatically based on vendor name"
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={product.description}
              onChange={handleInputChange}
              required
              multiline
              rows={4}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate('/products')}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? 'Saving...' : editMode ? 'Update Product' : 'Add Product'}
              </Button>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddProduct;
