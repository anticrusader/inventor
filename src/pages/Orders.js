import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Checkbox,
  InputAdornment,
  TextField,
  Card,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { useNavigate } from 'react-router-dom';

const statsCards = [
  { title: 'Total orders', value: '25,430', copyIcon: true },
  { title: 'Active orders', value: '23,210', copyIcon: true },
  { title: 'Complete orders', value: '20,210', copyIcon: true },
  { title: 'Cancelled orders', value: '10,201', copyIcon: true },
];

const orderData = [
  {
    id: 'BLPL-6343',
    customerName: 'Bessie Cooper',
    phone: '907.555.0141',
    dateTime: '12-7-2023 23:26',
    totalProducts: 20,
    totalAmount: '$326.85',
    status: 'Paid',
  },
  {
    id: 'BLPL-6232',
    customerName: 'Esther Howard',
    phone: '219.555.0114',
    dateTime: '12-30-2023 05:48',
    totalProducts: 20,
    totalAmount: '$854.08',
    status: 'Paid',
  },
  // Add more order data as needed
];

const Orders = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Orders
        </Typography>
        <Button
          variant="contained"
          sx={{ px: 3 }}
          startIcon={<img src="/add-icon.svg" alt="" />}
          onClick={() => navigate('/add-order')}
        >
          Add Orders
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 4 }}>
        {statsCards.map((card, index) => (
          <Card key={index} sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography color="text.secondary" variant="body2">
                {card.title}
              </Typography>
              {card.copyIcon && (
                <IconButton size="small">
                  <ContentCopyOutlinedIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
            <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
              {card.value}
            </Typography>
          </Card>
        ))}
      </Box>

      {/* Active Order List */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Active order list
      </Typography>

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

      {/* Orders Table */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>Bill no</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Phone No</TableCell>
              <TableCell>Date Time</TableCell>
              <TableCell>Total Products</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Paid Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderData.map((row) => (
              <TableRow key={row.id}>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.customerName}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.dateTime}</TableCell>
                <TableCell>{row.totalProducts}</TableCell>
                <TableCell>{row.totalAmount}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton size="small">
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <DeleteOutlineOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Orders;
