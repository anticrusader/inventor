import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Avatar,
  ClickAwayListener,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Link,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StoreIcon from '@mui/icons-material/Store';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [moreAnchorEl, setMoreAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  const handleMenuClick = (event, menu) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setActiveMenu(menu);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setActiveMenu(null);
  };

  const handleMoreClick = (event) => {
    setMoreAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setMoreAnchorEl(null);
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
    handleProfileMenuClose();
  };

  const mainMenuItems = [
    {
      label: 'Dashboard',
      path: '/',
      icon: <HomeIcon />,
    },
    {
      label: 'Products',
      path: '/products',
      icon: <InventoryIcon />,
      subItems: [
        { label: 'Add Product', path: '/add-product' },
        { label: 'Products Overview', path: '/products-overview' },
      ],
    },
    {
      label: 'Orders',
      path: '/orders',
      icon: <ShoppingCartIcon />,
      subItems: [
        { label: 'Add Order', path: '/add-order' },
      ],
    },
    {
      label: 'Stores',
      path: '/stores',
      icon: <StoreIcon />,
      subItems: [
        { label: 'Add Store', path: '/add-store' },
        { label: 'Stores Overview', path: '/stores-overview' },
      ],
    },
  ];

  const moreMenuItems = [
    {
      label: 'Groups',
      path: '/groups',
      subItems: [
        { label: 'Add Group', path: '/add-group' },
        { label: 'Groups Permissions', path: '/groups-permissions' },
      ],
    },
    {
      label: 'Brand',
      path: '/brand',
      subItems: [
        { label: 'Add Brand', path: '/add-brand' },
      ],
    },
    {
      label: 'Category',
      path: '/category',
      subItems: [
        { label: 'Add Category', path: '/add-category' },
      ],
    },
  ];

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <AppBar position="static" sx={{ backgroundColor: '#0B1120', boxShadow: 'none' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Left section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                fontFamily: 'Space Grotesk',
                fontWeight: 700,
                color: 'white',
                textDecoration: 'none',
              }}
            >
              INVENTOR
            </Typography>
          </Box>

          {/* Center section */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            {mainMenuItems.map((item) => (
              <Box key={item.label}>
                <Button
                  onClick={() => handleNavClick(item.path)}
                  startIcon={item.icon}
                  endIcon={item.subItems && (
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, item.label)}
                      sx={{
                        ml: -1,
                        color: 'inherit',
                        '&:hover': { backgroundColor: 'transparent' }
                      }}
                    >
                      <KeyboardArrowDownIcon />
                    </IconButton>
                  )}
                  sx={{
                    color: location.pathname === item.path ? '#fff' : 'rgba(255,255,255,0.7)',
                    backgroundColor: location.pathname === item.path ? '#FE8A00' : 'transparent',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: location.pathname === item.path ? '#FE8A00' : 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  {item.label}
                </Button>
                {item.subItems && (
                  <Menu
                    anchorEl={menuAnchorEl}
                    open={Boolean(menuAnchorEl) && activeMenu === item.label}
                    onClose={handleMenuClose}
                    sx={{
                      '& .MuiPaper-root': {
                        backgroundColor: '#1a2233',
                        borderRadius: 2,
                        border: '1px solid rgba(255,255,255,0.1)',
                        mt: 1,
                      }
                    }}
                  >
                    {item.subItems.map((subItem) => (
                      <MenuItem
                        key={subItem.label}
                        onClick={() => {
                          handleNavClick(subItem.path);
                          handleMenuClose();
                        }}
                        sx={{
                          color: 'rgba(255,255,255,0.7)',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.1)',
                          }
                        }}
                      >
                        {subItem.label}
                      </MenuItem>
                    ))}
                  </Menu>
                )}
              </Box>
            ))}
            <Button
              onClick={handleMoreClick}
              endIcon={<KeyboardArrowDownIcon />}
              sx={{
                color: 'rgba(255,255,255,0.7)',
                px: 2,
                py: 1,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              More
            </Button>
            <Menu
              anchorEl={moreAnchorEl}
              open={Boolean(moreAnchorEl)}
              onClose={handleMoreClose}
              sx={{
                '& .MuiPaper-root': {
                  backgroundColor: '#1a2233',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.1)',
                  mt: 1,
                }
              }}
            >
              {moreMenuItems.map((item) => (
                <MenuItem
                  key={item.label}
                  onClick={() => {
                    handleNavClick(item.path);
                    handleMoreClose();
                  }}
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Right section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton sx={{ color: 'rgba(255,255,255,0.7)' }}>
              <SearchIcon />
            </IconButton>
            <IconButton sx={{ color: 'rgba(255,255,255,0.7)' }}>
              <NotificationsIcon />
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              anchorEl={profileAnchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              id="primary-search-account-menu"
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(profileAnchorEl)}
              onClose={handleProfileMenuClose}
            >
              <MenuItem onClick={handleProfile}>
                Profile
              </MenuItem>
              <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
            <Typography sx={{ ml: 2 }}>{user.username}</Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
