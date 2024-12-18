import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Avatar,
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
  AreaChart,
  Cell,
  LineChart,
  Line,
  Label,
  Sector,
  ComposedChart,
  Bar
} from 'recharts';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import StorefrontIcon from '@mui/icons-material/Storefront';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import api from '../services/api';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

const StyledCard = ({ title, count, change, icon: Icon, path }) => (
  <Paper
    sx={{
      position: 'relative',
      background: 'linear-gradient(135deg, rgba(0, 71, 50, 0.2) 0%, rgba(0, 40, 28, 0.2) 100%)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(46, 213, 115, 0.15)',
      borderRadius: '16px',
      p: 2.5,
      height: '100%',
      overflow: 'hidden',
    }}
  >
    <Box sx={{ 
      position: 'relative',
      background: 'linear-gradient(135deg, rgba(0, 40, 28, 0.6) 0%, rgba(0, 30, 20, 0.6) 100%)',
      borderRadius: '12px',
      p: 2,
      mb: 2
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ 
          backgroundColor: 'rgba(46, 213, 115, 0.1)',
          borderRadius: '12px',
          p: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon sx={{ color: '#2ED573', fontSize: 24 }} />
        </Box>
        <IconButton sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          <MoreHorizIcon />
        </IconButton>
      </Box>

      <Typography variant="h3" sx={{ 
        color: '#fff',
        fontSize: '28px',
        fontWeight: 600,
        letterSpacing: '-0.5px',
        mt: 2,
        mb: 1
      }}>
        {count}
      </Typography>
    </Box>

    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="body2" sx={{ 
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '14px'
      }}>
        {title}
      </Typography>
      <Box sx={{ 
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: 'rgba(46, 213, 115, 0.1)',
        borderRadius: '20px',
        px: 1.5,
        py: 0.5
      }}>
        <TrendingUpIcon sx={{ color: '#2ED573', fontSize: 16, mr: 0.5 }} />
        <Typography sx={{ 
          color: '#2ED573',
          fontSize: '12px',
          fontWeight: 500
        }}>
          {change}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

const CustomizedLabel = ({ cx, cy }) => {
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
      <tspan x={cx} dy="-0.5em" fontSize="12" fill="#fff" textAnchor="middle">
        Total store
      </tspan>
      <tspan x={cx} dy="1.5em" fontSize="16" fill="#fff" fontWeight="bold" textAnchor="middle">
        100%
      </tspan>
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: '#1a2233',
          p: 1.5,
          border: 'none',
          borderRadius: 1,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#4CAF50',
              mr: 1
            }}
          />
          <Typography variant="body2" sx={{ color: '#fff' }}>
            {payload[0].payload.status}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: '#4CAF50', ml: 1 }}
          >
            ↑ {payload[0].payload.percentage}
          </Typography>
        </Box>
      </Box>
    );
  }
  return null;
};

const topProducts = [
  { 
    id: '22739',
    name: 'Jenny Wilson',
    avatar: '/avatars/1.jpg',
    size: '3.2 Kib',
    price: '$1,000',
    stock: '62 pairs'
  },
  { 
    id: '22739',
    name: 'Theresa Webb',
    avatar: '/avatars/2.jpg',
    size: '2.2 Kib',
    price: '$3,000',
    stock: '62 pairs'
  },
  { 
    id: '22739',
    name: 'Cameron Williamson',
    avatar: '/avatars/3.jpg',
    size: '4.2 Kib',
    price: '$1,000',
    stock: '62 pairs'
  },
];

const bestSellingProducts = [
  {
    position: '1st',
    image: '/products/tshirt1.png',
    name: 'T-Shirt',
    status: 'Stocked Product',
    saleAmount: '$19,000',
    quantity: '110 in Stock'
  },
  {
    position: '2nd',
    image: '/products/tshirt2.png',
    name: 'T-Shirt',
    status: 'Stocked Product',
    saleAmount: '$19,000',
    quantity: '120 in Stock'
  },
  {
    position: '3rd',
    image: '/products/tshirt3.png',
    name: 'T-Shirt',
    status: 'Stocked Product',
    saleAmount: '$19,000',
    quantity: '100 in Stock'
  },
  {
    position: '4th',
    image: '/products/tshirt4.png',
    name: 'T-Shirt',
    status: 'Stocked Product',
    saleAmount: '$19,000',
    quantity: '90 in Stock'
  },
  {
    position: '5th',
    image: '/products/tshirt5.png',
    name: 'T-Shirt',
    status: 'Stocked Product',
    saleAmount: '$19,000',
    quantity: '140 in Stock'
  }
];

const salesDataForSalesCard = [
  { name: 'SAT', value: 8 },
  { name: 'SUN', value: 15 },
  { name: 'MON', value: 10 },
  { name: 'TUE', value: 8 },
  { name: 'WED', value: 12 },
  { name: 'THU', value: 15 },
  { name: 'FRI', value: 10 }
];

const SalesCard = () => {
  return (
    <Paper
      sx={{
        background: 'linear-gradient(180deg, #2196F3 0%, rgba(33, 150, 243, 0.7) 100%)',
        height: '100%',
        minHeight: 200,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" sx={{ color: '#fff' }}>Sales</Typography>
          <Box
            sx={{
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: '#4CAF50' }}
            >
              ↑ 12%
            </Typography>
          </Box>
        </Box>
        <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>$12.09</Typography>
      </Box>
      
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesDataForSalesCard}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fff" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#fff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              dy={10}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <Box
                      sx={{
                        backgroundColor: '#1a2233',
                        p: 1.5,
                        border: 'none',
                        borderRadius: 1,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    >
                      <Typography variant="body2" sx={{ color: '#fff' }}>
                        ${payload[0].value.toFixed(2)}
                      </Typography>
                    </Box>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#fff"
              strokeWidth={2}
              fill="url(#salesGradient)"
              dot={false}
              activeDot={{
                r: 4,
                fill: '#fff',
                stroke: '#2196F3',
                strokeWidth: 2
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

const orderData = [
  { name: 'SAT', value: 15000, barValue: 10000 },
  { name: 'SUN', value: 18000, barValue: 8000 },
  { name: 'MON', value: 16000, barValue: 6000 },
  { name: 'TUE', value: 20000, barValue: 12000 },
  { name: 'WED', value: 17000, barValue: 7000 },
  { name: 'THU', value: 15000, barValue: 8000 },
  { name: 'FRI', value: 22000, barValue: 18000 }
];

const OrderOverviewCard = ({ data }) => {
  const [activePoint, setActivePoint] = useState(null);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            background: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            p: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ color: '#fff', fontSize: '14px' }}>
              {payload[0].payload.name}
            </Typography>
            <Typography sx={{ color: '#2196F3', fontSize: '14px', fontWeight: 600 }}>
              ${(payload[0].payload.value / 1000).toFixed(1)}k
            </Typography>
          </Box>
        </Box>
      );
    }
    return null;
  };

  return (
    <Paper sx={{
      background: 'linear-gradient(135deg, rgba(0, 71, 50, 0.2) 0%, rgba(0, 40, 28, 0.2) 100%)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(46, 213, 115, 0.15)',
      borderRadius: '16px',
      p: 3,
      height: '100%'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#fff', fontSize: '18px', fontWeight: 600 }}>
          Order Overview
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
            Montly
          </Typography>
          <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            <KeyboardArrowDownIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ width: '100%', height: 300, mt: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            onMouseMove={(e) => {
              if (e.activeTooltipIndex !== undefined) {
                setActivePoint(e.activeTooltipIndex);
              }
            }}
            onMouseLeave={() => setActivePoint(null)}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(33, 150, 243, 0.3)" />
                <stop offset="100%" stopColor="rgba(33, 150, 243, 0)" />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2196F3" />
                <stop offset="100%" stopColor="#2196F3" />
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              vertical={false}
              horizontal={true}
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              tickFormatter={(value) => `$${value/1000}k`}
            />

            <Bar 
              dataKey="barValue" 
              fill="url(#barGradient)"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="url(#lineGradient)"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                fill: '#2196F3',
                stroke: '#fff',
                strokeWidth: 2
              }}
            />

            <Tooltip 
              content={<CustomTooltip />}
              cursor={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

const OrderByStoreCard = ({ data }) => {
  const totalValue = 135; // Fixed total value as shown in the design
  const [activeIndex, setActiveIndex] = useState(null);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    const isAmazon = props.payload.name === 'Amazon';
    const isActive = activeIndex === props.index;
    
    const radiusExtension = isAmazon ? 8 : (isActive ? 5 : 0);

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + radiusExtension}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={isActive || isAmazon ? 1 : 0.8}
        />
      </g>
    );
  };

  return (
    <Paper sx={{
      background: 'linear-gradient(135deg, rgba(0, 71, 50, 0.2) 0%, rgba(0, 40, 28, 0.2) 100%)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(46, 213, 115, 0.15)',
      borderRadius: '16px',
      p: 3,
      height: '100%'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h6" sx={{ color: '#fff', fontSize: '18px', fontWeight: 600 }}>
          Order By store
        </Typography>
        <IconButton sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          <MoreHorizIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
        {/* Left side - Progress bars */}
        <Box sx={{ flex: '0 0 60%' }}>
          {data.map((item, index) => (
            <Box key={index} sx={{ mb: 3.5, '&:last-child': { mb: 0 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&::before': {
                    content: '""',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: item.color
                  }
                }}>
                  {item.name}
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                  {item.value}%
                </Typography>
              </Box>
              <Box sx={{ 
                width: '300px', // Fixed width container
                height: '8px', 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <Box sx={{ 
                  width: `${item.value}%`, 
                  height: '100%', 
                  backgroundColor: item.color,
                  borderRadius: '4px',
                  transition: 'width 0.5s ease-in-out'
                }} />
              </Box>
            </Box>
          ))}
        </Box>

        {/* Right side - Donut chart */}
        <Box sx={{ position: 'relative', width: '200px', height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                startAngle={90}
                endAngle={450}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                shape={renderActiveShape}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={index} 
                    fill={entry.color}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <Box
                        sx={{
                          background: 'rgba(0, 0, 0, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '8px 12px',
                        }}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          color: '#fff',
                          '&::before': {
                            content: '""',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: payload[0].payload.color
                          }
                        }}>
                          <Typography sx={{ fontSize: '14px' }}>
                            {payload[0].name}: {payload[0].value}%
                          </Typography>
                        </Box>
                      </Box>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <Typography sx={{ 
              color: '#fff', 
              fontSize: '16px', 
              fontWeight: 500,
              opacity: 0.7
            }}>
              Total store
            </Typography>
            <Typography sx={{ 
              color: '#fff', 
              fontSize: '24px', 
              fontWeight: 700,
              mt: 0.5
            }}>
              {totalValue}%
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalProducts: 0,
      activeProducts: 0,
      deactiveProducts: 0,
      totalStores: 0,
      totalOrders: 0,
      totalSales: 0
    },
    storeStats: [],
    weeklyOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.getDashboardStats();
        setDashboardData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      title: 'Total Products',
      count: dashboardData.stats.totalProducts.toLocaleString(),
      change: '+1.5% Since last week',
      icon: InventoryIcon,
      path: '/products'
    },
    {
      title: 'Total paid Orders',
      count: `$${dashboardData.stats.totalSales.toLocaleString()}`,
      change: '+12% Since last week',
      icon: ShoppingCartIcon,
      path: '/orders'
    },
    {
      title: 'Total User',
      count: '18,540k',
      change: '+15% Since last week',
      icon: PeopleIcon,
      path: '/users'
    },
    {
      title: 'Total Stores',
      count: dashboardData.stats.totalStores.toLocaleString(),
      change: '+20% Since last week',
      icon: StorefrontIcon,
      path: '/stores'
    }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#fff' }}>
          Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<FilterAltIcon />}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)'
            }
          }}
        >
          Filter
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StyledCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <OrderByStoreCard data={dashboardData.storeStats} />
        </Grid>
        <Grid item xs={12} md={6}>
          <OrderOverviewCard data={dashboardData.weeklyOrders} />
        </Grid>
      </Grid>

      {/* Sales Charts */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ height: '400px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6">Sales price</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: '#4CAF50', display: 'flex', alignItems: 'center' }}
                  >
                    ↑ 12%
                  </Typography>
                </Box>
              </Box>
              <IconButton sx={{ color: 'white' }}>
                <MoreHorizIcon />
              </IconButton>
            </Box>
            <Box sx={{ width: '100%', height: 'calc(100% - 48px)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[]}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    domain={[0, 30]}
                    ticks={[0, 5, 10, 15, 20, 25, 30]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4CAF50"
                    strokeWidth={2}
                    dot={{
                      fill: '#4CAF50',
                      strokeWidth: 2,
                      r: 4,
                      strokeDasharray: ''
                    }}
                    activeDot={{
                      fill: '#4CAF50',
                      strokeWidth: 2,
                      r: 6,
                      stroke: '#fff'
                    }}
                  />
                  <area
                    type="monotone"
                    dataKey="value"
                    stroke="none"
                    fill="url(#colorValue)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <SalesCard />
        </Grid>
      </Grid>

      {/* Products Table */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={7}>
          <Paper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Top products</Typography>
              <IconButton sx={{ color: 'white' }}>
                <MoreHorizIcon />
              </IconButton>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox sx={{ color: 'rgba(255,255,255,0.7)' }} />
                    </TableCell>
                    <TableCell>ID Number</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topProducts.map((product) => (
                    <TableRow key={product.id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox sx={{ color: 'rgba(255,255,255,0.7)' }} />
                      </TableCell>
                      <TableCell>ID: {product.id}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar src={product.avatar} sx={{ mr: 2 }} />
                          {product.name}
                        </Box>
                      </TableCell>
                      <TableCell>{product.size}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Best Selling Product</Typography>
              <IconButton sx={{ color: 'white' }}>
                <MoreHorizIcon />
              </IconButton>
            </Box>
            <Box>
              {bestSellingProducts.map((product, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 2,
                    borderBottom: index !== bestSellingProducts.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255,255,255,0.7)',
                        width: '40px'
                      }}
                    >
                      {product.position}
                    </Typography>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}
                    >
                      <Box
                        component="img"
                        src={product.image}
                        sx={{
                          width: 24,
                          height: 24,
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body1">{product.name}</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        {product.status}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body1">{product.saleAmount}</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      {product.quantity}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
