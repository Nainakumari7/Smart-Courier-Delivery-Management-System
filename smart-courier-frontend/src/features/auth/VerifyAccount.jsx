import React, { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Container, Alert, InputAdornment } from '@mui/material';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Key, ShieldCheck, ArrowRight } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import AnimatedPage from '../../components/AnimatedPage';

const VerifyAccount = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    email: location.state?.email || '', 
    otp: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post('/auth/verify-otp', { email: formData.email, otp: formData.otp });
      setSuccess(true);
      setTimeout(() => navigate('/login', { state: { message: 'Account verified successfully! Please login.' } }), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Verification failed. Please check the code and try again.');
    } finally {
      setLoading(false);
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
                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(37,99,235,0.3)',
              }}
            >
              <ShieldCheck size={32} color="white" />
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
                Verify Account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Enter your email and the 6-digit code we sent you
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>Account verified! Redirecting to login...</Alert>}

            <form onSubmit={handleVerifySubmit}>
              <TextField
                id="verify-email"
                fullWidth label="Email Address" name="email" margin="normal" required type="email"
                value={formData.email} onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Mail size={18} color="#68769F" /></InputAdornment>,
                }}
              />
              <TextField
                id="verify-otp"
                fullWidth label="Verification Code" name="otp" margin="normal" required
                value={formData.otp} onChange={handleChange}
                inputProps={{ minLength: 6, maxLength: 6 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Key size={18} color="#68769F" /></InputAdornment>,
                }}
              />
              <Button
                id="verify-submit"
                fullWidth type="submit" variant="contained" size="large"
                disabled={loading || success}
                sx={{
                  mt: 3, mb: 2, height: 52, fontSize: '1rem',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                  '&:hover': { background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' },
                }}
                endIcon={!loading && <ArrowRight size={20} />}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </form>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Back to{' '}
                <Typography
                  component={Link} to="/login" variant="body2"
                  sx={{ color: 'primary.main', fontWeight: 700, '&:hover': { textDecoration: 'underline' } }}
                >
                  Log in
                </Typography>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default VerifyAccount;
