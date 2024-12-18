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
  Box,
} from '@mui/material';
import { 
  PieChart, 
  Pie, 
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart
} from 'recharts';

const salesData = [
  { name: 'SUN', value: 10 },
  { name: 'MON', value: 12 },
  { name: 'TUE', value: 15 },
  { name: 'WED', value: 11 },
  { name: 'THU', value: 18 },
  { name: 'FRI', value: 20 },
];

const orderByStore = [
  { name: 'Amazon', value: 50 },
  { name: 'Facebook', value: 20 },
  { name: 'Pinterest', value: 25 },
  { name: 'Email marketing', value: 30 },
];

const topProducts = [
  { id: '43756', name: 'Nike Laura', size: '6.5 KG', price: '$15,000', stock: '82 pairs' },
  { id: '26728', name: 'Puma Beauty', size: '4.2 KG', price: '$8,000', stock: '82 pairs' },
  { id: '70688', name: 'Bata Daniels', size: '22 KG', price: '$2,000', stock: '82 pairs' },
  { id: '43778', name: 'Vince Mikolli', size: '2.3 KG', price: '$16,000', stock: '82 pairs' },
  { id: '43978', name: 'Varga Dora', size: '1.8 KG', price: '$12,000', stock: '82 pairs' },
];

const topUsers = [
  { name: 'Naushad Khan', role: 'Brooklyn Simmons' },
  { name: 'Yogesh Wovoth Shinde', role: 'Cameron Williamson' },
  { name: 'Rutuja Nandanvar Shinde', role: 'Kathryn Murphy' },
  { name: 'Afzal Khan', role: 'Kristin Watson' },
  { name: 'Dheeraj Jadhav', role: 'Cameron Williamson' },
];

const bestSellingProducts = [
  { name: 'Adidas Orkstro Shoes Blue 24', status: 'In Stock' },
  { name: 'Adidas Ultraboost 2.0 Dan Running', status: 'In Stock' },
  { name: 'Adidas Orkstro Shoes Blue 24', status: 'In Stock' },
  { name: 'Adidas Adicolor Sst Track Jacket', status: 'In Stock' },
  { name: 'Adidas Ultraboost 2.0 Dan Running', status: 'In Stock' },
];

const Dashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle2" color="textSecondary">Total Products</Typography>
            <Typography variant="h4">25,430</Typography>
            <Typography variant="body2" color="success.main">↑ 25%</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle2" color="textSecondary">Total Sales</Typography>
            <Typography variant="h4">$16,000</Typography>
            <Typography variant="body2" color="success.main">↑ 15%</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle2" color="textSecondary">Total Users</Typography>
            <Typography variant="h4">18,540k</Typography>
            <Typography variant="body2" color="success.main">↑ 35%</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle2" color="textSecondary">Total Stores</Typography>
            <Typography variant="h4">24,763</Typography>
            <Typography variant="body2" color="success.main">↑ 25%</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Order By Store</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderByStore}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Order Overview</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Top Products Table */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Top Products</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.size}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>Edit Delete</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Top Users</Typography>
            {topUsers.map((user, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="subtitle2">{user.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{user.role}</Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Best Selling Products</Typography>
            {bestSellingProducts.map((product, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="subtitle2">{product.name}</Typography>
                  <Typography variant="body2" color="success.main">{product.status}</Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
