import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StoreIcon from '@mui/icons-material/Store';
import GroupIcon from '@mui/icons-material/Group';
import CategoryIcon from '@mui/icons-material/Category';
import BusinessIcon from '@mui/icons-material/Business';
import SettingsIcon from '@mui/icons-material/Settings';
import AssessmentIcon from '@mui/icons-material/Assessment';

const drawerWidth = 240;

const menuItems = [
  // { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },  // Temporarily hidden
  { text: 'Products', icon: <InventoryIcon />, path: '/products' },
  // { text: 'Orders', icon: <ShoppingCartIcon />, path: '/orders' },  // Temporarily hidden
  { text: 'Stores', icon: <StoreIcon />, path: '/stores' },
  { text: 'Groups', icon: <GroupIcon />, path: '/groups' },
  { text: 'Categories', icon: <CategoryIcon />, path: '/categories' },
  { text: 'Company', icon: <BusinessIcon />, path: '/company' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
];

const Sidebar = ({ mobileOpen, onDrawerToggle, sx = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const drawer = (
    <>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ color: 'white' }}>
          Inventor
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{ 
                  '& .MuiListItemText-primary': { 
                    color: 'white',
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal'
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundColor: '#1A1F2D',
            ...sx['& .MuiDrawer-paper'],
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundColor: '#1A1F2D',
            ...sx['& .MuiDrawer-paper'],
          },
          ...sx,
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Sidebar;
