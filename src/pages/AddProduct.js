import React, { useState } from 'react';
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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import LinkIcon from '@mui/icons-material/Link';
import ImageIcon from '@mui/icons-material/Image';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const AddProduct = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);

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
      // Handle file upload
      const newImages = Array.from(e.dataTransfer.files).map(file => 
        URL.createObjectURL(file)
      );
      setImages([...images, ...newImages]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      const newImages = Array.from(e.target.files).map(file => 
        URL.createObjectURL(file)
      );
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate('/products')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          Add Products
        </Typography>
      </Box>

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
            <Box sx={{ mb: 2 }}>
              <img src="/image-placeholder.svg" alt="Upload" style={{ width: 64, height: 64 }} />
            </Box>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Drag & Drop file here
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Or click to browse (4 mb max)
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
            Do Same size format such as Sales, number and USD($ etc) throughout
          </Typography>

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
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    '&:hover': { bgcolor: 'background.paper' },
                  }}
                  onClick={() => removeImage(index)}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Paper>
            ))}
          </Stack>
        </Grid>

        {/* Right Column - Product Details */}
        <Grid item xs={12} md={7}>
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
                  endAdornment: <InputAdornment position="end">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SKU"
                placeholder="Enter sku"
                select
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Qty"
                placeholder="Enter qty"
                select
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Description</Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <IconButton size="small">
                  <FormatBoldIcon />
                </IconButton>
                <IconButton size="small">
                  <FormatItalicIcon />
                </IconButton>
                <IconButton size="small">
                  <FormatUnderlinedIcon />
                </IconButton>
                <IconButton size="small">
                  <FormatAlignLeftIcon />
                </IconButton>
                <IconButton size="small">
                  <FormatAlignCenterIcon />
                </IconButton>
                <IconButton size="small">
                  <FormatAlignRightIcon />
                </IconButton>
                <IconButton size="small">
                  <LinkIcon />
                </IconButton>
                <IconButton size="small">
                  <ImageIcon />
                </IconButton>
              </Stack>
              <TextField
                fullWidth
                placeholder="Enter Description"
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Color"
                placeholder="Enter Color"
                select
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Size"
                placeholder="Enter Size"
                select
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Brands"
                placeholder="Enter Brands"
                select
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                placeholder="Enter Category"
                select
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Store"
                placeholder="Enter Store"
                select
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Availability"
                placeholder="Enter Availability"
                select
              />
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/products')}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ px: 3 }}
            >
              Publish Product
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddProduct;
