import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Layout/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
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
import Categories from './pages/Categories';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00E074', // Primary green color
      light: '#00E074',
      dark: '#00E074',
    },
    secondary: {
      main: '#00A6FF', // Secondary blue color
      light: '#00A6FF',
      dark: '#00A6FF',
    },
    accent: {
      main: '#FF1474', // Accent pink color
      light: '#FF1474',
      dark: '#FF1474',
    },
    button: {
      main: '#FE8A00', // Button orange color
      light: '#FE8A00',
      dark: '#FE8A00',
    },
    background: {
      default: '#0B1120',
      paper: '#1a2233',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: 'Space Grotesk, sans-serif',
    h1: {
      fontFamily: 'Space Grotesk',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'Space Grotesk',
      fontWeight: 700,
    },
    h3: {
      fontFamily: 'Space Grotesk',
      fontWeight: 700,
    },
    h4: {
      fontFamily: 'Space Grotesk',
      fontWeight: 700,
    },
    h5: {
      fontFamily: 'Space Grotesk',
      fontWeight: 700,
    },
    h6: {
      fontFamily: 'Space Grotesk',
      fontWeight: 700,
    },
    subtitle1: {
      fontFamily: 'Space Grotesk',
      fontWeight: 500,
    },
    subtitle2: {
      fontFamily: 'Space Grotesk',
      fontWeight: 500,
    },
    body1: {
      fontFamily: 'Space Grotesk',
      fontWeight: 400,
    },
    body2: {
      fontFamily: 'Space Grotesk',
      fontWeight: 400,
    },
    button: {
      fontFamily: 'Space Grotesk',
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
        containedPrimary: {
          backgroundColor: '#FE8A00',
          '&:hover': {
            backgroundColor: '#ff9a1f',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 16,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: 'rgba(255, 255, 255, 0.7)',
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
            <Route path="/edit-product/:id" element={<EditProduct />} />
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
            <Route path="/categories" element={<Categories />} />
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
