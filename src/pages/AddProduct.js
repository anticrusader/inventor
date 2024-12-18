import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  Select,
  MenuItem,
  Grid,
  InputAdornment,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatListBulleted,
  Link,
  Image,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);

  const handleImageDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer?.files || event.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      setMainImage(URL.createObjectURL(imageFiles[0]));
      setImages(prev => [...prev, ...imageFiles.slice(1).map(file => URL.createObjectURL(file))]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const textEditorButtons = [
    { icon: <FormatBold />, label: 'Bold' },
    { icon: <FormatItalic />, label: 'Italic' },
    { icon: <FormatUnderlined />, label: 'Underline' },
    { icon: <FormatAlignLeft />, label: 'Align Left' },
    { icon: <FormatAlignCenter />, label: 'Align Center' },
    { icon: <FormatAlignRight />, label: 'Align Right' },
    { icon: <FormatListBulleted />, label: 'List' },
    { icon: <Link />, label: 'Link' },
    { icon: <Image />, label: 'Image' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Add Products</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          {/* Image Upload Section */}
          <Paper
            sx={{
              p: 2,
              height: 300,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed #ccc',
              cursor: 'pointer',
              position: 'relative',
              mb: 2,
            }}
            onDrop={handleImageDrop}
            onDragOver={handleDragOver}
            component="label"
          >
            {mainImage ? (
              <Box
                component="img"
                src={mainImage}
                alt="Product"
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
            ) : (
              <>
                <Box
                  component="img"
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/%3E%3C/svg%3E"
                  alt="Upload"
                  sx={{ width: 64, height: 64, mb: 2 }}
                />
                <Typography variant="body1" color="textSecondary">
                  Drag & Drop file here
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  or click to browse
                </Typography>
              </>
            )}
            <input
              type="file"
              hidden
              accept="image/*"
              multiple
              onChange={handleImageDrop}
            />
          </Paper>

          {/* Thumbnail Images */}
          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', py: 1 }}>
            {images.map((image, index) => (
              <Paper
                key={index}
                sx={{
                  width: 80,
                  height: 80,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  component="img"
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
              </Paper>
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={7}>
          {/* Product Details Form */}
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Name"
                  placeholder="Enter product name..."
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Price"
                  placeholder="Enter price"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="SKU"
                  placeholder="Enter sku"
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Qty"
                  placeholder="Enter qty"
                  type="number"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Description</Typography>
                <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {textEditorButtons.map((button, index) => (
                    <IconButton key={index} size="small">
                      {button.icon}
                    </IconButton>
                  ))}
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Enter Description"
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Color"
                  select
                  defaultValue=""
                >
                  <MenuItem value="">Select Color</MenuItem>
                  <MenuItem value="red">Red</MenuItem>
                  <MenuItem value="blue">Blue</MenuItem>
                  <MenuItem value="black">Black</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Size"
                  select
                  defaultValue=""
                >
                  <MenuItem value="">Select Size</MenuItem>
                  <MenuItem value="s">Small</MenuItem>
                  <MenuItem value="m">Medium</MenuItem>
                  <MenuItem value="l">Large</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Brands"
                  select
                  defaultValue=""
                >
                  <MenuItem value="">Select Brand</MenuItem>
                  <MenuItem value="nike">Nike</MenuItem>
                  <MenuItem value="adidas">Adidas</MenuItem>
                  <MenuItem value="puma">Puma</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Category"
                  select
                  defaultValue=""
                >
                  <MenuItem value="">Select Category</MenuItem>
                  <MenuItem value="shoes">Shoes</MenuItem>
                  <MenuItem value="clothing">Clothing</MenuItem>
                  <MenuItem value="accessories">Accessories</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Store"
                  select
                  defaultValue=""
                >
                  <MenuItem value="">Select Store</MenuItem>
                  <MenuItem value="store1">Store 1</MenuItem>
                  <MenuItem value="store2">Store 2</MenuItem>
                  <MenuItem value="store3">Store 3</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Availability"
                  select
                  defaultValue=""
                >
                  <MenuItem value="">Select Availability</MenuItem>
                  <MenuItem value="instock">In Stock</MenuItem>
                  <MenuItem value="outofstock">Out of Stock</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                  <Button variant="outlined" onClick={() => navigate('/products')}>
                    Cancel
                  </Button>
                  <Button variant="contained" color="primary">
                    Publish Product
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddProduct;
