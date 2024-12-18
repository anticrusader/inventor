import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  MenuItem,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import ImageUpload from '../components/ImageUpload';
import api from '../services/api';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    category: '',
    description: '',
    status: 'active',
    sku: '',
    images: [],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load categories first
        const categoriesData = await api.getCategories();
        console.log('Loaded categories:', categoriesData);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);

        // Then load product data
        const productResponse = await api.getProduct(id);
        const product = productResponse.data;
        
        setFormData({
          name: product.name || '',
          price: product.price || '',
          quantity: product.quantity || '',
          category: product.category || '',
          description: product.description || '',
          status: product.status || 'active',
          sku: product.sku || '',
          images: product.images ? product.images.map(img => ({
            name: img,
            url: `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/uploads/products/${img}`,
            isExisting: true
          })) : []
        });
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message || 'Failed to load product data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (newImages) => {
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const data = new FormData();
      
      // Add all non-image fields
      Object.keys(formData).forEach(key => {
        if (key !== 'images') {
          data.append(key, formData[key]);
        }
      });

      // Handle existing images
      const existingImages = formData.images
        .filter(img => img.isExisting)
        .map(img => img.name);
      
      data.append('existingImages', JSON.stringify(existingImages));

      // Add new image files
      formData.images
        .filter(img => !img.isExisting && img.file)
        .forEach(img => {
          data.append('images', img.file);
        });

      console.log('Submitting form data:');
      console.log('- Existing images:', existingImages);
      console.log('- Form fields:', Object.fromEntries(data.entries()));

      const response = await api.updateProduct(id, data);
      console.log('Update response:', response.data);
      
      if (response.data) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/products', { state: { refresh: true } });
        }, 1500);
      } else {
        throw new Error('No response data received');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setError(error.response?.data?.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Product
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Product updated successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!formData.category}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  label="Category"
                  name="category"
                  value={formData.category || ''}
                  onChange={handleInputChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!formData.status}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  label="Status"
                  name="status"
                  value={formData.status || ''}
                  onChange={handleInputChange}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SKU"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <ImageUpload
                images={formData.images}
                onChange={handleImageChange}
                maxImages={5}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/products')}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  startIcon={saving && <CircularProgress size={20} />}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default EditProduct;
