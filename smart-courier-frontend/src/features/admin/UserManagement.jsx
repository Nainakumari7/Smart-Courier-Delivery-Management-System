import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, Button, InputAdornment, Grid,
  Card, CardContent, Alert, Stack, Divider, Chip, Avatar, Dialog,
  DialogTitle, DialogContent, DialogActions, TableContainer, Table,
  TableHead, TableRow, TableCell, TableBody, IconButton
} from '@mui/material';
import { Search, User, Shield, Mail, Lock, Unlock, AlertTriangle, Eye, RefreshCw } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import AnimatedPage from '../../components/AnimatedPage';

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionResult, setActionResult] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null, userId: null });

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Frontend filtering for simplicity since we have the full list
    if (!searchQuery.trim()) {
      fetchUsers();
    } else {
      const filtered = users.filter(u => 
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id.toString() === searchQuery
      );
      setUsers(filtered);
    }
  };

  const handleBlockAction = async () => {
    const { action, userId: id } = confirmDialog;
    setActionLoading(true);
    setActionResult(null);
    try {
      const endpoint = action === 'block' ? `/admin/users/${id}/block` : `/admin/users/${id}/unblock`;
      await axiosInstance.put(endpoint);
      setActionResult({ type: 'success', message: `User ${action}ed successfully` });
      
      // Update local state instead of full refresh
      setUsers(users.map(u => u.id === id ? { ...u, blocked: action === 'block' } : u));
      if (selectedUser && selectedUser.id === id) {
        setSelectedUser({ ...selectedUser, blocked: action === 'block' });
      }
    } catch (err) {
      setActionResult({ type: 'error', message: err.message || `Failed to ${action} user` });
    } finally {
      setActionLoading(false);
      setConfirmDialog({ open: false, action: null, userId: null });
    }
  };

  const getRoleBadge = (user) => {
    return user?.role === 'ROLE_ADMIN'
      ? { label: 'Admin', color: '#F59E0B', bg: '#FEF3C7', icon: <Shield size={14} /> }
      : { label: 'Customer', color: '#059669', bg: '#D1FAE5', icon: <User size={14} /> };
  };

  return (
    <AnimatedPage>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
          User Management
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>Manage user accounts and status</Typography>

        {/* Search & Actions */}
        <Paper
          component="form"
          onSubmit={handleSearch}
          sx={{
            p: 2.5, mb: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider',
            display: 'flex', gap: 2, alignItems: 'center',
          }}
        >
          <TextField
            placeholder="Search by username, email, or ID..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search size={18} color="#68769F" /></InputAdornment>,
            }}
          />
          <Button type="submit" variant="contained" sx={{ px: 4, borderRadius: 3 }}>Search</Button>
          <Button startIcon={<RefreshCw size={18} />} onClick={fetchUsers} sx={{ borderRadius: 3 }}>Refresh</Button>
        </Paper>

        {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}
        {actionResult && (
          <Alert severity={actionResult.type} sx={{ mb: 3 }} onClose={() => setActionResult(null)}>
            {actionResult.message}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Users Table */}
          <Grid item xs={12} lg={selectedUser ? 7 : 12}>
            <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => {
                    const badge = getRoleBadge(user);
                    return (
                      <TableRow 
                        key={user.id} 
                        hover 
                        selected={selectedUser?.id === user.id}
                        onClick={() => setSelectedUser(user)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>#{user.id}</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={badge.label} 
                            size="small" 
                            sx={{ fontWeight: 700, bgcolor: badge.bg, color: badge.color, height: 24 }} 
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.blocked ? 'Blocked' : 'Active'} 
                            variant={user.blocked ? 'filled' : 'outlined'}
                            color={user.blocked ? 'error' : 'success'}
                            size="small"
                            sx={{ fontWeight: 700, height: 24 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" color="primary"><Eye size={18} /></IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {users.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                        <Typography color="text.secondary">No users found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* User Details Card (Visible when a user is selected) */}
          {selectedUser && (
            <Grid item xs={12} lg={5}>
              <Card sx={{ borderRadius: 4, overflow: 'visible', border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ height: 60, background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)', borderRadius: '16px 16px 0 0' }} />
                <CardContent sx={{ mt: -4, textAlign: 'center', pb: 4 }}>
                  <Avatar
                    sx={{
                      width: 64, height: 64, mx: 'auto', mb: 1.5,
                      bgcolor: 'primary.main', fontSize: '1.5rem', fontWeight: 800,
                      border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  >
                    {selectedUser.username?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>{selectedUser.username}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{selectedUser.email}</Typography>

                  <Divider sx={{ my: 2 }} />

                  <Stack spacing={1.5} sx={{ textAlign: 'left', mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">User ID</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>#{selectedUser.id}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">Role</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedUser.role}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">Account Status</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: selectedUser.blocked ? 'error.main' : 'success.main' }}>
                        {selectedUser.blocked ? 'Blocked' : 'Active'}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack spacing={2}>
                    {selectedUser.blocked ? (
                      <Button
                        variant="contained" color="success" fullWidth
                        startIcon={<Unlock size={18} />}
                        onClick={() => setConfirmDialog({ open: true, action: 'unblock', userId: selectedUser.id })}
                        sx={{ borderRadius: 3 }}
                      >
                        Unblock User
                      </Button>
                    ) : (
                      <Button
                        variant="contained" color="error" fullWidth
                        startIcon={<Lock size={18} />}
                        onClick={() => setConfirmDialog({ open: true, action: 'block', userId: selectedUser.id })}
                        sx={{ borderRadius: 3 }}
                      >
                        Block User
                      </Button>
                    )}
                    <Button variant="outlined" fullWidth onClick={() => setSelectedUser(null)} sx={{ borderRadius: 3 }}>
                      Close Details
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        {/* Confirm Dialog */}
        <Dialog
          open={confirmDialog.open}
          onClose={() => setConfirmDialog({ open: false, action: null, userId: null })}
          PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>
            {confirmDialog.action === 'block' ? 'Block User?' : 'Unblock User?'}
          </DialogTitle>
          <DialogContent>
            <Typography color="text.secondary">
              {confirmDialog.action === 'block'
                ? 'This will prevent the user from logging in or creating deliveries.'
                : 'This will restore the user\'s access to the platform.'}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setConfirmDialog({ open: false, action: null, userId: null })}>Cancel</Button>
            <Button
              variant="contained"
              color={confirmDialog.action === 'block' ? 'error' : 'success'}
              onClick={handleBlockAction}
              disabled={actionLoading}
            >
              {actionLoading ? 'Processing...' : (confirmDialog.action === 'block' ? 'Block' : 'Unblock')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AnimatedPage>
  );
};

export default UserManagement;
