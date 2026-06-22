import React, { useState, useContext } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Avatar,
  Menu, MenuItem, Drawer, List, ListItem, ListItemIcon, ListItemText,
  Divider, useMediaQuery, useTheme
} from '@mui/material';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import {
  Package, Truck, User, LogOut, Menu as MenuIcon, LayoutDashboard,
  Search, BarChart3, Heart, Shield, Users, Settings, X, Plus, ChevronRight,
  Sun, Moon
} from 'lucide-react';
import { ColorModeContext } from '../App';

const CUSTOMER_NAV = [
  { label: 'Dashboard', path: '/customer/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'My Deliveries', path: '/customer/deliveries', icon: <Package size={20} /> },
  { label: 'New Delivery', path: '/delivery/create', icon: <Plus size={20} /> },
];

const ADMIN_NAV = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Deliveries', path: '/admin/deliveries', icon: <Truck size={20} /> },
  { label: 'Users', path: '/admin/users', icon: <Users size={20} /> },
  { label: 'Reports', path: '/admin/reports', icon: <BarChart3 size={20} /> },
];

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleClose();
  };

  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname);
  const navItems = user?.role === 'ROLE_ADMIN' ? ADMIN_NAV : CUSTOMER_NAV;
  const isActive = (path) => location.pathname === path;

  const renderSidebar = () => (
    <Box sx={{ width: 260, p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, px: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Package size={24} color="#059669" />
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>SmartCourier</Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={() => setDrawerOpen(false)} size="small"><X size={18} /></IconButton>
        )}
      </Box>

      <Divider sx={{ mb: 2 }} />

      <List sx={{ p: 0 }}>
        {navItems.map((item) => (
          <ListItem
            key={item.path}
            onClick={() => { navigate(item.path); setDrawerOpen(false); }}
            sx={{
              borderRadius: 3,
              mb: 0.5,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              ...(isActive(item.path) ? {
                background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                color: '#fff',
                boxShadow: '0 4px 16px rgba(26,35,126,0.3)',
                '& .MuiListItemIcon-root': { color: '#fff' },
              } : {
                color: 'text.secondary',
                '&:hover': { bgcolor: 'rgba(26,35,126,0.06)', color: 'primary.main' },
              }),
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: isActive(item.path) ? '#fff' : 'text.secondary' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
            />
            {isActive(item.path) && <ChevronRight size={16} />}
          </ListItem>
        ))}
      </List>

      {/* User info at bottom of drawer */}
      {isAuthenticated && (
        <Box sx={{ mt: 'auto', pt: 4 }}>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1 }}>
            <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36, fontSize: '0.9rem', fontWeight: 700 }}>
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.3 }} noWrap>{user?.username}</Typography>
              <Typography variant="caption" color="text.secondary" noWrap>{user?.email}</Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar — desktop only, when authenticated */}
      {isAuthenticated && !isAuthPage && !isMobile && (
        <Box
          component="nav"
          sx={{
            width: 260,
            flexShrink: 0,
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          {renderSidebar()}
        </Box>
      )}

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { borderRadius: '0 20px 20px 0' } }}
      >
        {renderSidebar()}
      </Drawer>

      {/* Main content area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
        {/* Top bar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid',
            borderColor: 'divider',
            color: 'text.primary',
          }}
        >
          <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
            {/* Mobile menu toggle or logo */}
            {isAuthenticated && !isAuthPage && isMobile && (
              <IconButton onClick={() => setDrawerOpen(true)} edge="start" sx={{ mr: 1 }}>
                <MenuIcon size={22} />
              </IconButton>
            )}

            {/* Logo — show only on auth pages or mobile */}
            {(isAuthPage || isMobile) && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Package size={24} color="#059669" />
                <Typography
                  variant="h6"
                  component={Link}
                  to="/"
                  sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '-0.5px' }}
                >
                  SmartCourier
                </Typography>
              </Box>
            )}

            <Box sx={{ flexGrow: 1 }} />

            {/* Right side actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                {theme.palette.mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </IconButton>
              
              {isAuthenticated ? (
                <>
                  <IconButton onClick={handleMenu}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 36,
                        height: 36,
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        transition: 'all 0.2s',
                        '&:hover': { boxShadow: '0 0 0 3px rgba(26,35,126,0.2)' },
                      }}
                    >
                      {user?.username?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                      sx: {
                        mt: 1.5, borderRadius: 3, minWidth: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                        border: '1px solid', borderColor: 'divider',
                      },
                    }}
                  >
                    <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{user?.username}</Typography>
                      <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
                    </Box>
                    <MenuItem onClick={() => { navigate('/profile'); handleClose(); }} sx={{ py: 1.5 }}>
                      <User size={16} style={{ marginRight: 12 }} /> Profile
                    </MenuItem>
                    <MenuItem onClick={() => { navigate('/settings'); handleClose(); }} sx={{ py: 1.5 }}>
                      <Settings size={16} style={{ marginRight: 12 }} /> Settings
                    </MenuItem>
                    <MenuItem onClick={() => { navigate(user?.role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/customer/dashboard'); handleClose(); }} sx={{ py: 1.5 }}>
                      <LayoutDashboard size={16} style={{ marginRight: 12 }} /> Dashboard
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
                      <LogOut size={16} style={{ marginRight: 12 }} /> Sign Out
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button component={Link} to="/login" color="primary" sx={{ fontWeight: 600 }}>Login</Button>
                  <Button component={Link} to="/signup" variant="contained" color="primary">Sign Up</Button>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box component="main" sx={{ flexGrow: 1, py: { xs: 2, md: 4 }, px: { xs: 2, md: 4 } }}>
          <Container maxWidth="xl" disableGutters>
            {children}
          </Container>
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 2.5,
            px: 4,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            © {new Date().getFullYear()} SmartCourier Delivery Management System — All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
