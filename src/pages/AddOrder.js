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
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import LinkIcon from '@mui/icons-material/Link';
import ImageIcon from '@mui/icons-material/Image';

const AddOrder = () => {
  const navigate = useNavigate();
  const [orderDate, setOrderDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate('/orders')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          Add Orders
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Customer Name"
            placeholder="Enter customer name..."
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Customer Address"
            placeholder="Enter Customer Address"
            multiline
            rows={2}
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Color"
            placeholder="Enter Color"
            select
            sx={{ mb: 3 }}
          >
            <MenuItem value="red">Red</MenuItem>
            <MenuItem value="blue">Blue</MenuItem>
            <MenuItem value="green">Green</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Brands"
            placeholder="Enter Brands"
            select
            sx={{ mb: 3 }}
          >
            <MenuItem value="brand1">Brand 1</MenuItem>
            <MenuItem value="brand2">Brand 2</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Product"
            placeholder="Enter product name..."
            select
            sx={{ mb: 3 }}
          >
            <MenuItem value="product1">Product 1</MenuItem>
            <MenuItem value="product2">Product 2</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone No"
            placeholder="+1"
            sx={{ mb: 3 }}
          />
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Order Date"
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ 
                  '& .MuiInputLabel-root': {
                    transform: 'translate(14px, -9px) scale(0.75)',
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CalendarTodayIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Delivery Date"
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ 
                  '& .MuiInputLabel-root': {
                    transform: 'translate(14px, -9px) scale(0.75)',
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CalendarTodayIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <TextField
            fullWidth
            label="Size"
            placeholder="Enter Size"
            select
            sx={{ mb: 3 }}
          >
            <MenuItem value="small">Small</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="large">Large</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Category"
            placeholder="Enter Category"
            select
            sx={{ mb: 3 }}
          >
            <MenuItem value="category1">Category 1</MenuItem>
            <MenuItem value="category2">Category 2</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Rate"
            type="number"
            sx={{ mb: 3 }}
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
            sx={{ mb: 3 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Gross Amount"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Vat 10%"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Discount"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Net Amount"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/orders')}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ px: 3 }}
            >
              Create Order
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddOrder;
