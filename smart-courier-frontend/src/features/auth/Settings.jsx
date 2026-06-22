import React, { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Container, Alert } from '@mui/material';
import { Lock, Save, CheckCircle } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import AnimatedPage from '../../components/AnimatedPage';

const Settings = () => {
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState(null);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }
    setPwLoading(true);
    setPwError(null);
    setPwSuccess(false);
    try {
      await axiosInstance.post('/auth/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setPwSuccess(true);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwError(err.message || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage your account settings and security
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                p: 1.5, borderRadius: 3,
                background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                display: 'flex',
              }}
            >
              <Lock size={20} color="white" />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Change Password</Typography>
              <Typography variant="body2" color="text.secondary">Update your account password</Typography>
            </Box>
          </Box>

          {pwError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setPwError(null)}>{pwError}</Alert>}
          {pwSuccess && <Alert severity="success" sx={{ mb: 2 }} icon={<CheckCircle size={20} />}>Password changed successfully!</Alert>}

          <form onSubmit={handlePasswordChange}>
            <TextField
              id="current-password"
              fullWidth label="Current Password" type="password" margin="normal" required
              value={passwordData.oldPassword}
              onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
            />
            <TextField
              id="new-password"
              fullWidth label="New Password" type="password" margin="normal" required
              value={passwordData.newPassword}
              inputProps={{ minLength: 6 }}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            />
            <TextField
              id="confirm-password"
              fullWidth label="Confirm New Password" type="password" margin="normal" required
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              error={passwordData.confirmPassword !== '' && passwordData.newPassword !== passwordData.confirmPassword}
              helperText={
                passwordData.confirmPassword !== '' && passwordData.newPassword !== passwordData.confirmPassword
                  ? 'Passwords do not match' : ''
              }
            />
            <Button
              id="change-password-submit"
              type="submit" variant="contained" size="large" disabled={pwLoading}
              sx={{ mt: 3, height: 48 }}
              startIcon={<Save size={18} />}
            >
              {pwLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </Paper>
      </Container>
    </AnimatedPage>
  );
};

export default Settings;
