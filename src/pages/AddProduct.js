import React, { useState } from 'react';
import api from '../services/api';
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
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    name: '',
    price: '',
    sku: '',
    quantity: '',
    description: '',
    status: 'Active',
    category: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    const newImageFiles = Array.from(files);
    const newImageUrls = newImageFiles.map(file => URL.createObjectURL(file));
    setImageFiles(prev => [...prev, ...newImageFiles]);
    setImages(prev => [...prev, ...newImageUrls]);
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    setImages(newImages);
    setImageFiles(newImageFiles);
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    try {
      if (!product.name || !product.price || !product.quantity || !product.category || !product.description) {
        alert('Please fill in all required fields');
        return;
      }

      if (isNaN(product.price) || product.price < 0) {
        alert('Please enter a valid price (must be a positive number)');
        return;
      }

      if (isNaN(product.quantity) || product.quantity < 0) {
        alert('Please enter a valid quantity (must be a positive number)');
        return;
      }

      setLoading(true);

      const formData = new FormData();
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      Object.keys(product).forEach(key => {
        formData.append(key, product[key]);
      });

      const response = await api.addProduct(formData);
      console.log('Product added successfully:', response.data);
      navigate('/products');
    } catch (error) {
      console.error('Error publishing product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to publish product. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate('/products')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          Add Products
        </Typography>
      </Box>

      <form onSubmit={handlePublish}>
        <Grid container spacing={4}>
          {/* Left Column - Image Upload */}
          <Grid item xs={12} md={5}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Upload Image</Typography>
            <Box
              sx={{
                border: '2px dashed',
                borderColor: dragActive ? 'primary.main' : 'grey.300',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                bgcolor: 'grey.50',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}
            >
              <input
                type="file"
                id="file-input"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                style={{ display: 'none' }}
              />
              <Typography variant="body1" sx={{ mb: 1 }}>
                Drag & Drop file here
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Or click to browse (4 mb max)
              </Typography>
            </Box>

            {/* Image Preview */}
            <Stack direction="row" spacing={2} sx={{ mt: 3, overflowX: 'auto', py: 1 }}>
              {images.map((image, index) => (
                <Paper
                  key={index}
                  sx={{
                    position: 'relative',
                    width: 80,
                    height: 80,
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 8,
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeImage(index)}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      bgcolor: 'background.paper',
                      boxShadow: 1,
                      '&:hover': { bgcolor: 'error.light', color: 'white' },
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Paper>
              ))}
            </Stack>
          </Grid>

          {/* Right Column - Product Details */}
          <Grid item xs={12} md={7}>
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
                    value={product.price}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
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
                <Grid item xs={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={product.category}
                      onChange={handleInputChange}
                      label="Category"
                    >
                      <MenuItem value="ring">Ring</MenuItem>
                      <MenuItem value="necklace">Necklace</MenuItem>
                      <MenuItem value="bracelet">Bracelet</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Availability</InputLabel>
                    <Select
                      name="status"
                      value={product.status}
                      onChange={handleInputChange}
                      label="Availability"
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Deactive">Deactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="SKU"
                name="sku"
                value={product.sku}
                onChange={handleInputChange}
              />

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
                >
                  {loading ? 'Publishing...' : 'Publish Product'}
                </Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default AddProduct;
