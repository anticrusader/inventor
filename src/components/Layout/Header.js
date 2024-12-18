import React, { useState } from 'react';
import {
  AppBar,
  IconButton,
  Button,
  Box,
  Avatar,
  InputBase,
  alpha,
  styled,
  Container,
  Collapse,
  ClickAwayListener,
  Menu,
  MenuItem,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

// Custom styled search input
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  display: 'flex',
  alignItems: 'center',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '0px',
  transition: theme.transitions.create('width', {
    duration: theme.transitions.duration.standard,
  }),
  '&.Mui-expanded': {
    width: '200px',
    marginRight: theme.spacing(1),
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}));

// Custom styled navigation button
const NavButton = styled(Button)(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  padding: theme.spacing(1, 2),
  textTransform: 'none',
  borderRadius: '8px',
  margin: theme.spacing(0, 0.5),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [moreAnchorEl, setMoreAnchorEl] = useState(null);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
  };

  const handleClickAway = () => {
    setIsSearchExpanded(false);
  };

  const handleMoreClick = (event) => {
    setMoreAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setMoreAnchorEl(null);
  };

  const mainMenuItems = [
    {
      label: 'Dashboard',
      path: '/',
    },
    {
      label: 'Products',
      path: '/products',
      subItems: [
        { label: 'Add Product', path: '/add-product' },
        { label: 'Products Overview', path: '/products-overview' },
      ],
    },
    {
      label: 'Orders',
      path: '/orders',
      subItems: [
        { label: 'Add Order', path: '/add-order' },
      ],
    },
    {
      label: 'Stores',
      path: '/stores',
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
    {
      label: 'Company',
      path: '/company',
      subItems: [
        { label: 'Add Company', path: '/add-company' },
      ],
    },
    {
      label: 'Profile Settings',
      path: '/profile-settings',
      subItems: [
        { label: 'Notification Management', path: '/notification-management' },
      ],
    },
    {
      label: 'Attributes',
      path: '/attributes',
      subItems: [
        { label: 'Attributes Value', path: '/attributes-value' },
        { label: 'Add Attributes', path: '/add-attributes' },
      ],
    },
    {
      label: 'Reports',
      path: '/reports',
    },
  ];

  return (
    <AppBar position="static" color="default" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid #eaeaea' }}>
      <Container maxWidth="xl">
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          height: '64px',
          position: 'relative'
        }}>
          {/* Logo on the left */}
          <Box sx={{ 
            position: 'absolute',
            left: 0,
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer' 
          }} onClick={() => navigate('/')}>
            <img src="/logo.svg" alt="Inventor" style={{ height: 32 }} />
          </Box>

          {/* Navigation centered */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flex: 1,
            ml: '120px' // Space for logo
          }}>
            {mainMenuItems.map((item) => (
              <NavButton
                key={item.path}
                active={isActive(item.path)}
                onClick={() => navigate(item.path)}
                startIcon={<img src={`/icon-${item.label.toLowerCase()}.svg`} alt="" />}
              >
                {item.label}
              </NavButton>
            ))}
            <NavButton
              endIcon={<MoreHorizIcon />}
              onClick={handleMoreClick}
            >
              More
            </NavButton>
          </Box>

          {/* Right Section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 2,
            position: 'absolute',
            right: 0
          }}>
            <ClickAwayListener onClickAway={handleClickAway}>
              <Search>
                <SearchIconWrapper onClick={handleSearchClick}>
                  <SearchIcon />
                </SearchIconWrapper>
                <Collapse in={isSearchExpanded} orientation="horizontal">
                  <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                    className={isSearchExpanded ? 'Mui-expanded' : ''}
                    autoFocus={isSearchExpanded}
                  />
                </Collapse>
              </Search>
            </ClickAwayListener>

            <IconButton size="large" color="inherit">
              <NotificationsIcon />
            </IconButton>

            <Avatar 
              sx={{ cursor: 'pointer' }} 
              onClick={() => navigate('/profile')}
            />
          </Box>
        </Box>
      </Container>
      <Menu
        anchorEl={moreAnchorEl}
        open={Boolean(moreAnchorEl)}
        onClose={handleMoreClose}
      >
        {moreMenuItems.map((item) => (
          <div key={item.path}>
            <MenuItem onClick={() => {
              navigate(item.path);
              handleMoreClose();
            }}>
              {item.label}
            </MenuItem>
            {item.subItems && item.subItems.map((subItem) => (
              <MenuItem
                key={subItem.path}
                onClick={() => {
                  navigate(subItem.path);
                  handleMoreClose();
                }}
                sx={{ pl: 4 }}
              >
                {subItem.label}
              </MenuItem>
            ))}
          </div>
        ))}
      </Menu>
    </AppBar>
  );
};

export default Header;
