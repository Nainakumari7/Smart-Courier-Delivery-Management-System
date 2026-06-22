import React, { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Container, Alert, InputAdornment, LinearProgress, Snackbar } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ArrowRight, Key } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import AnimatedPage from '../../components/AnimatedPage';

const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
const strengthColors = ['', '#FF1744', '#FF9800', '#FFB300', '#00C853', '#00C853'];

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post('/auth/signup', formData);
      setOtpSent(true);
      setError(null);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post('/auth/verify-otp', { email: formData.email, otp });
      setOtpVerified(true);
      setTimeout(() => navigate('/login', { state: { message: 'Account verified successfully! Please login.' } }), 1500);
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code and try again.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <Container maxWidth="sm">
        <Box sx={{ mt: { xs: 3, md: 5 }, mb: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Branding */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 72, height: 72, borderRadius: '20px', mx: 'auto', mb: 2,
                background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(255,109,0,0.3)',
              }}
            >
              <UserPlus size={32} color="white" />
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
                Create Account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Join SmartCourier today
              </Typography>
            </Box>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
              <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
            </Snackbar>

            {otpVerified && step === 2 && !loading && <Alert severity="success" sx={{ mb: 3 }}>Account verified! Redirecting to login...</Alert>}
            {otpSent && step === 2 && !otpVerified && !loading && <Alert severity="info" sx={{ mb: 3 }}>OTP sent to your email!</Alert>}

            {step === 1 ? (
              <form onSubmit={handleSubmit}>
              <TextField
                id="signup-username"
                fullWidth label="Username" name="username" margin="normal" required
                value={formData.username} onChange={handleChange}
                inputProps={{ minLength: 3, maxLength: 50 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><User size={18} color="#68769F" /></InputAdornment>,
                }}
              />
              <TextField
                id="signup-email"
                fullWidth label="Email Address" name="email" margin="normal" required type="email"
                value={formData.email} onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Mail size={18} color="#68769F" /></InputAdornment>,
                }}
              />
              <TextField
                id="signup-password"
                fullWidth label="Password" name="password" type="password" margin="normal" required
                value={formData.password} onChange={handleChange}
                inputProps={{ minLength: 6, maxLength: 40 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Lock size={18} color="#68769F" /></InputAdornment>,
                }}
              />

              {/* Password strength bar */}
              {formData.password && (
                <Box sx={{ mt: 1, mb: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(passwordStrength / 5) * 100}
                    sx={{
                      height: 4, borderRadius: 2, bgcolor: '#E0E5F2',
                      '& .MuiLinearProgress-bar': { bgcolor: strengthColors[passwordStrength] },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: strengthColors[passwordStrength], fontWeight: 600 }}>
                    {strengthLabels[passwordStrength]}
                  </Typography>
                </Box>
              )}

              <Button
                id="signup-submit"
                fullWidth type="submit" variant="contained" size="large"
                disabled={loading || otpSent}
                sx={{
                  mt: 3, mb: 2, height: 52, fontSize: '1rem',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
                  '&:hover': { background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)' },
                }}
                endIcon={!loading && <ArrowRight size={20} />}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
            ) : (
              <form onSubmit={handleOtpSubmit}>
                <Typography variant="body2" sx={{ mb: 2, textAlign: 'center', color: 'text.secondary' }}>
                  Please enter the 6-digit verification code sent to <strong>{formData.email}</strong>.
                </Typography>
                <TextField
                  id="signup-otp"
                  fullWidth label="Verification Code" name="otp" margin="normal" required
                  value={otp} onChange={(e) => setOtp(e.target.value)}
                  inputProps={{ minLength: 6, maxLength: 6 }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Key size={18} color="#68769F" /></InputAdornment>,
                  }}
                />
                <Button
                  id="verify-submit"
                  fullWidth type="submit" variant="contained" size="large"
                  disabled={loading || otpVerified}
                  sx={{
                    mt: 3, mb: 2, height: 52, fontSize: '1rem',
                    background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
                    '&:hover': { background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)' },
                  }}
                  endIcon={!loading && <ArrowRight size={20} />}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </form>
            )}

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Typography
                  component={Link} to="/login" variant="body2"
                  sx={{ color: 'primary.main', fontWeight: 700, '&:hover': { textDecoration: 'underline' } }}
                >
                  Log in
                </Typography>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Have a verification code?{' '}
                <Typography
                  component={Link} to="/verify-account" variant="body2"
                  sx={{ color: 'primary.main', fontWeight: 700, '&:hover': { textDecoration: 'underline' } }}
                >
                  Verify now
                </Typography>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default Signup;
