import React from 'react';
import { Box, Typography, Button, Grid, Paper, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';

const Reports = () => {
  // Sample data for the chart
  const chartData = [
    { name: 'Jan', value: 10 },
    { name: 'Feb', value: 20 },
    { name: 'Mar', value: 30 },
    { name: 'Apr', value: 50 },
    { name: 'May', value: 40 },
    { name: 'Jun', value: 60 },
  ];

  // Sample data for the table
  const tableData = [
    { month: 'Mon 16 Jun', year: '2022', amount: '$19,000' },
    { month: 'Thu 11 Jun', year: '2022', amount: '$1,000' },
    { month: 'Thu 04 Jun', year: '2021', amount: '$5,000' },
    { month: 'Mon 08 Jun', year: '2021', amount: '$12,000' },
    { month: 'Mon 01 Jun', year: '2020', amount: '$12,000' },
    { month: 'Mon 28 Jun', year: '2021', amount: '$10,000' },
    { month: 'Fri 19 Jun', year: '2020', amount: '$13,000' },
    { month: 'Thu 11 Jun', year: '2021', amount: '$11,000' },
    { month: 'Thu 04 Jun', year: '2021', amount: '$10,000' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1">Reports</Typography>
        <Button
          variant="outlined"
          startIcon={<FilterAltOutlinedIcon />}
          sx={{ borderRadius: '8px' }}
        >
          Filter
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Chart Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Total parking report</Typography>
              <Button variant="text" endIcon={<MoreHorizIcon />}>
                Actions
              </Button>
            </Box>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Reports</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2 }}>
                  <Typography variant="h4">100%</Typography>
                  <Typography variant="body2" color="text.secondary">Total parking</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2 }}>
                  <Typography variant="h4">86%</Typography>
                  <Typography variant="body2" color="text.secondary">Product parking</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2 }}>
                  <Typography variant="h4">97%</Typography>
                  <Typography variant="body2" color="text.secondary">New Orders</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2 }}>
                  <Typography variant="h4">81%</Typography>
                  <Typography variant="body2" color="text.secondary">New Stores</Typography>
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button variant="text">View Full Report</Button>
              <Typography variant="body2" color="text.secondary">Reports 758</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Table Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Total paid orders</Typography>
              <Typography variant="subtitle1" color="text.secondary">Report date</Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell>Month</TableCell>
                    <TableCell>Year</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell padding="checkbox">
                        <Checkbox />
                      </TableCell>
                      <TableCell>{row.month}</TableCell>
                      <TableCell>{row.year}</TableCell>
                      <TableCell>{row.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
