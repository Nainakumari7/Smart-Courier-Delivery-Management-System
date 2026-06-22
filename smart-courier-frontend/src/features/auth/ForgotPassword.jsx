import React, { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Container, Alert, InputAdornment } from '@mui/material';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import AnimatedPage from '../../components/AnimatedPage';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <Container maxWidth="sm">
        <Box sx={{ mt: { xs: 4, md: 8 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 }, width: '100%', borderRadius: 4,
              bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
              boxShadow: '0 8px 40px rgba(27,37,89,0.08)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 64, height: 64, borderRadius: '18px', mx: 'auto', mb: 2,
                  background: 'linear-gradient(135deg, #2979FF 0%, #75A7FF 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(41,121,255,0.3)',
                }}
              >
                <Mail size={28} color="white" />
              </Box>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, color: 'primary.main' }}>
                Forgot Password?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Enter your email and we'll send you a reset link
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                If an account exists for that email, a password reset link has been sent.
              </Alert>
            )}

            {!success ? (
              <form onSubmit={handleSubmit}>
                <TextField
                  id="forgot-email"
                  fullWidth label="Email Address" type="email" margin="normal" required autoFocus
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Mail size={18} color="#68769F" /></InputAdornment>,
                  }}
                />
                <Button
                  id="forgot-submit"
                  fullWidth type="submit" variant="contained" size="large" disabled={loading}
                  sx={{ mt: 3, mb: 2, height: 52,  fontSize: '1rem' }}
                  endIcon={<Send size={18} />}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            ) : null}

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button component={Link} to="/login" startIcon={<ArrowLeft size={16} />} sx={{ fontWeight: 600 }}>
                Back to Login
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default ForgotPassword;
