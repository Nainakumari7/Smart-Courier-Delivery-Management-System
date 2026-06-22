import React, { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Container, Alert, InputAdornment, IconButton, Divider, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, LogIn, Package, ArrowRight } from 'lucide-react';
import { loginStart, loginSuccess, loginFailure } from '../../store/authSlice';
import axiosInstance from '../../api/axiosInstance';
import AnimatedPage from '../../components/AnimatedPage';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    dispatch({ type: 'auth/clearError' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const response = await axiosInstance.post('/auth/login', { username, password });
      // JwtResponse: { token, id, username, email, role }
      const { token, id, username: uname, email, role } = response.data;
      const user = { id, username: uname, email, role };
      dispatch(loginSuccess({ user, token }));
      navigate(role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/customer/dashboard');
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please check your credentials.';
      dispatch(loginFailure(errorMessage));
    }
  };

  return (
    <AnimatedPage>
      <Container maxWidth="sm">
        <Box sx={{ mt: { xs: 4, md: 8 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Branding header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 72, height: 72, borderRadius: '20px', mx: 'auto', mb: 2,
                background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(26,35,126,0.3)',
              }}
            >
              <Package size={32} color="white" />
            </Box>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 }, width: '100%', borderRadius: 4,
              bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
              boxShadow: '0 8px 40px rgba(27,37,89,0.08)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, color: 'primary.main' }}>
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to manage your deliveries
              </Typography>
            </Box>

            <Snackbar 
              open={!!error} 
              autoHideDuration={6000} 
              onClose={handleCloseSnackbar} 
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert 
                severity="error" 
                onClose={handleCloseSnackbar}
                sx={{ width: '100%' }}
                action={
                  error && (error.toLowerCase().includes('disabled') || error.toLowerCase().includes('verify')) ? (
                    <Button color="inherit" size="small" component={Link} to="/verify-account">
                      VERIFY NOW
                    </Button>
                  ) : null
                }
              >
                {error}
              </Alert>
            </Snackbar>

            <form onSubmit={handleSubmit}>
              <TextField
                id="login-username"
                fullWidth
                label="Username"
                margin="normal"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <User size={18} color="#68769F" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                id="login-password"
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                margin="normal"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={18} color="#68769F" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ textAlign: 'right', mt: 1 }}>
                <Typography
                  variant="body2"
                  component={Link}
                  to="/forgot-password"
                  sx={{ color: 'primary.main', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
                >
                  Forgot password?
                </Typography>
              </Box>

              <Button
                id="login-submit"
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 3, mb: 2, height: 52, fontSize: '1rem',
                  background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                }}
                endIcon={!loading && <ArrowRight size={20} />}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <Divider sx={{ my: 3, '&::before, &::after': { borderColor: 'divider' } }}>
              <Typography variant="caption" color="text.secondary" sx={{ px: 2 }}>or</Typography>
            </Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Typography
                  component={Link}
                  to="/signup"
                  variant="body2"
                  sx={{ color: 'primary.main', fontWeight: 700, '&:hover': { textDecoration: 'underline' } }}
                >
                  Create an account
                </Typography>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default Login;
