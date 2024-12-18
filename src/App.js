import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Layout/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import ProductsOverview from './pages/ProductsOverview';
import Orders from './pages/Orders';
import AddOrder from './pages/AddOrder';
import Stores from './pages/Stores';
import AddStore from './pages/AddStore';
import StoresOverview from './pages/StoresOverview';
import Groups from './pages/Groups';
import AddGroup from './pages/AddGroup';
import GroupsPermissions from './pages/GroupsPermissions';
import Brand from './pages/Brand';
import AddBrand from './pages/AddBrand';
import Category from './pages/Category';
import AddCategory from './pages/AddCategory';
import Company from './pages/Company';
import AddCompany from './pages/AddCompany';
import Profile from './pages/Profile';
import ProfileSettings from './pages/ProfileSettings';
import NotificationManagement from './pages/NotificationManagement';
import Attributes from './pages/Attributes';
import AttributesValue from './pages/AttributesValue';
import AddAttributes from './pages/AddAttributes';
import Reports from './pages/Reports';

const theme = createTheme({
  typography: {
    fontFamily: '"Space Grotesk", sans-serif',
    h1: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 500,
    },
    h5: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 500,
    },
    h6: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 500,
    },
    subtitle1: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 500,
    },
    subtitle2: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 500,
    },
    body1: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 400,
    },
    button: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 500,
      textTransform: 'none',
    },
    caption: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 400,
    },
    overline: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 400,
    },
  },
  palette: {
    primary: {
      main: '#00E074', // Primary green color
      contrastText: '#fff',
    },
    secondary: {
      main: '#00A6FF', // Secondary blue color
      light: '#FF1474', // Secondary pink color
      contrastText: '#fff',
    },
    button: {
      main: '#FE8A00', // Button orange color
      contrastText: '#fff',
    },
    background: {
      default: '#fff',
      paper: '#fff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 500,
        },
        contained: {
          backgroundColor: '#FE8A00',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#e57c00',
          },
        },
        outlined: {
          borderColor: '#FE8A00',
          color: '#FE8A00',
          '&:hover': {
            borderColor: '#e57c00',
            color: '#e57c00',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#00E074',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 500,
          '&.Mui-selected': {
            color: '#00A6FF',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/products-overview" element={<ProductsOverview />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/add-order" element={<AddOrder />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/add-store" element={<AddStore />} />
            <Route path="/stores-overview" element={<StoresOverview />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/add-group" element={<AddGroup />} />
            <Route path="/groups-permissions" element={<GroupsPermissions />} />
            <Route path="/brand" element={<Brand />} />
            <Route path="/add-brand" element={<AddBrand />} />
            <Route path="/category" element={<Category />} />
            <Route path="/add-category" element={<AddCategory />} />
            <Route path="/company" element={<Company />} />
            <Route path="/add-company" element={<AddCompany />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile-settings" element={<ProfileSettings />} />
            <Route path="/notification-management" element={<NotificationManagement />} />
            <Route path="/attributes" element={<Attributes />} />
            <Route path="/attributes-value" element={<AttributesValue />} />
            <Route path="/add-attributes" element={<AddAttributes />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
