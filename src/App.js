import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <Header />
      {children}
    </>
  );
};

const PublicRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-product"
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-product/:id"
            element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products-overview"
            element={
              <ProtectedRoute>
                <ProductsOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-order"
            element={
              <ProtectedRoute>
                <AddOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stores"
            element={
              <ProtectedRoute>
                <Stores />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-store"
            element={
              <ProtectedRoute>
                <AddStore />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stores-overview"
            element={
              <ProtectedRoute>
                <StoresOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups"
            element={
              <ProtectedRoute>
                <Groups />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-group"
            element={
              <ProtectedRoute>
                <AddGroup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups-permissions"
            element={
              <ProtectedRoute>
                <GroupsPermissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/brand"
            element={
              <ProtectedRoute>
                <Brand />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-brand"
            element={
              <ProtectedRoute>
                <AddBrand />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category"
            element={
              <ProtectedRoute>
                <Category />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-category"
            element={
              <ProtectedRoute>
                <AddCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company"
            element={
              <ProtectedRoute>
                <Company />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-company"
            element={
              <ProtectedRoute>
                <AddCompany />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile-settings"
            element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notification-management"
            element={
              <ProtectedRoute>
                <NotificationManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attributes"
            element={
              <ProtectedRoute>
                <Attributes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attributes-value"
            element={
              <ProtectedRoute>
                <AttributesValue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-attributes"
            element={
              <ProtectedRoute>
                <AddAttributes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
