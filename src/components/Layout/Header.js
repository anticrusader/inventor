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

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
  };

  const handleClickAway = () => {
    setIsSearchExpanded(false);
  };

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
            <NavButton
              active={isActive('/')}
              onClick={() => navigate('/')}
              startIcon={<img src="/dashboard-icon.svg" alt="" />}
            >
              Dashboard
            </NavButton>
            <NavButton
              active={isActive('/products')}
              onClick={() => navigate('/products')}
              startIcon={<img src="/products-icon.svg" alt="" />}
            >
              Products
            </NavButton>
            <NavButton
              active={isActive('/orders')}
              onClick={() => navigate('/orders')}
              startIcon={<img src="/orders-icon.svg" alt="" />}
            >
              Orders
            </NavButton>
            <NavButton
              active={isActive('/stores')}
              onClick={() => navigate('/stores')}
              startIcon={<img src="/stores-icon.svg" alt="" />}
            >
              Stores
            </NavButton>
            <NavButton
              endIcon={<MoreHorizIcon />}
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

            <Avatar sx={{ cursor: 'pointer' }} />
          </Box>
        </Box>
      </Container>
    </AppBar>
  );
};

export default Header;
