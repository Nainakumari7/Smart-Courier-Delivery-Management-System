import React, { useEffect, useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Container, Alert, Grid, Card, CardContent, Divider, Avatar } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { User, Mail, Shield, Lock, Save, CheckCircle } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import { updateProfile } from '../../store/authSlice';
import AnimatedPage from '../../components/AnimatedPage';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/auth/me');
        setProfile(response.data);
        dispatch(updateProfile(response.data));
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [dispatch]);



  const roleBadge = profile?.role === 'ROLE_ADMIN'
    ? { label: 'Administrator', color: '#F59E0B', bg: '#FEF3C7' }
    : { label: 'Customer', color: '#059669', bg: '#D1FAE5' };

  return (
    <AnimatedPage>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          View your account details
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={4} justifyContent="center">
          {/* Profile Info Card */}
          <Grid item xs={12} sm={10} md={8}>
            <Card sx={{ borderRadius: 1, overflow: 'visible', textAlign: 'center', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <Box
                sx={{
                  height: 120, borderRadius: '4px 4px 0 0',
                  background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                }}
              />
              <CardContent sx={{ mt: -6, pb: 4 }}>
                <Avatar
                  sx={{
                    width: 100, height: 100, mx: 'auto', mb: 2,
                    bgcolor: 'secondary.main', fontSize: '2.5rem', fontWeight: 800,
                    border: '4px solid white',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  }}
                >
                  {profile?.username?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {profile?.username || user?.username}
                </Typography>
                <Box
                  sx={{
                    display: 'inline-flex', alignItems: 'center', gap: 0.5,
                    px: 2, py: 0.5, borderRadius: 2, mt: 1,
                    bgcolor: roleBadge.bg, color: roleBadge.color,
                  }}
                >
                  <Shield size={14} />
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>{roleBadge.label}</Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#F0F2F8' }}><User size={18} color="#68769F" /></Box>
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="caption" color="text.secondary">Username</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{profile?.username || user?.username}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#F0F2F8' }}><Mail size={18} color="#68769F" /></Box>
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="caption" color="text.secondary">Email</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{profile?.email || user?.email}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#F0F2F8' }}><Shield size={18} color="#68769F" /></Box>
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="caption" color="text.secondary">Account ID</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>#{profile?.id || user?.id}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </AnimatedPage>
  );
};

export default Profile;
