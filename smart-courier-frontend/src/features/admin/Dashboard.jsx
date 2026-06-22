import {
  Box, Typography, Grid, Paper, Chip, Stack, Skeleton, Alert,
  IconButton, Tooltip, Card, CardContent, Button, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import { Package, Activity, CheckCircle, Clock, XCircle, RefreshCcw, Users, Trash2, AlertTriangle } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
import AnimatedPage from '../../components/AnimatedPage';
import StatCard from '../../components/StatCard';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(null);

  const fetchData = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const [analyticsRes, healthRes] = await Promise.all([
        axiosInstance.get('/admin/analytics/summary'),
        axiosInstance.get('/admin/system/health'),
      ]);
      console.log('Admin Analytics Data:', analyticsRes.data);
      console.log('System Health Data:', healthRes.data);
      setAnalytics(analyticsRes.data);
      setHealth(healthRes.data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);
  
  const handleResetSystem = async () => {
    setResetLoading(true);
    setResetSuccess(null);
    try {
      await axiosInstance.delete('/admin/system/reset');
      setResetSuccess('System reset successfully! All test data cleared.');
      setResetDialogOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error resetting system:', err);
      setError(err.message || 'Failed to reset system');
    } finally {
      setResetLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <AnimatedPage>
        <Box>
          <Skeleton variant="text" width={300} height={48} sx={{ mb: 4 }} />
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[1, 2, 3, 4, 5].map(i => (
              <Grid item xs={12} sm={6} md key={i}>
                <Skeleton variant="rounded" height={110} sx={{ borderRadius: 4 }} />
              </Grid>
            ))}
          </Grid>
          <Skeleton variant="rounded" height={200} sx={{ borderRadius: 4 }} />
        </Box>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
              Admin Dashboard
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography color="text.secondary">System overview and key performance indicators</Typography>
              <Chip 
                label="LIVE" 
                size="small" 
                color="success" 
                sx={{ 
                  height: 20, 
                  fontSize: '0.65rem', 
                  fontWeight: 900, 
                  animation: 'pulse 2s infinite' 
                }} 
              />
            </Stack>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </Typography>
            <Tooltip title="Refresh data">
              <IconButton 
                onClick={() => fetchData(true)} 
                disabled={refreshing}
                sx={{ 
                  bgcolor: 'background.paper', 
                  border: '1px solid', 
                  borderColor: 'divider',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <RefreshCcw size={20} className={refreshing ? 'spin' : ''} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* KPI Cards */}
        {analytics && (
          <Grid container spacing={3} sx={{ mb: 5 }}>
            <Grid item xs={12} sm={6} md>
              <StatCard label="Total Deliveries" value={analytics.totalDeliveries} icon={<Package />} bgColor="#D1FAE5" iconColor="#059669" delay={0} />
            </Grid>
            <Grid item xs={12} sm={6} md>
              <StatCard label="Pending" value={analytics.pendingDeliveries} icon={<Clock />} bgColor="#FEF3C7" iconColor="#E65100" delay={100} />
            </Grid>
            <Grid item xs={12} sm={6} md>
              <StatCard label="Delivered" value={analytics.deliveredDeliveries} icon={<CheckCircle />} bgColor="#E8F5E9" iconColor="#2E7D32" delay={200} />
            </Grid>
            <Grid item xs={12} sm={6} md>
              <StatCard label="Cancelled" value={analytics.cancelledDeliveries} icon={<XCircle />} bgColor="#FCE4EC" iconColor="#C2185B" delay={300} />
            </Grid>
            <Grid item xs={12} sm={6} md>
              <StatCard label="Total Users" value={analytics.totalUsers} icon={<Users />} bgColor="#E0F2F1" iconColor="#00796B" delay={400} />
            </Grid>
          </Grid>
        )}

        {/* System Health Monitor */}
        {health && (
          <Paper sx={{ p: 4, mb: 5, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box
                sx={{
                  p: 1.5, borderRadius: 3, display: 'flex',
                  background: 'linear-gradient(135deg, #00C853 0%, #5EFC82 100%)',
                }}
              >
                <Activity size={22} color="white" />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>System Health</Typography>
                <Typography variant="body2" color="text.secondary">Live microservice status monitor</Typography>
              </Box>
            </Box>

            <Grid container spacing={2}>
              {Object.entries(health).map(([service, status]) => {
                const isUp = status === 'UP' || status === 'CONNECTED' || status === 'RUNNING';
                return (
                  <Grid item xs={12} sm={6} md={4} lg={2.4} key={service}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2, borderRadius: 3,
                        border: '1px solid', borderColor: isUp ? '#C8E6C9' : '#FFCDD2',
                        bgcolor: isUp ? '#F1F8F1' : '#FFF5F5',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'capitalize', fontSize: '0.8rem' }}>
                          {service.replace(/-/g, ' ')}
                        </Typography>
                      </Box>
                      <Chip
                        icon={
                          <Box
                            sx={{
                              width: 6, height: 6, borderRadius: '50%',
                              bgcolor: isUp ? '#4CAF50' : '#F44336',
                              animation: isUp ? 'pulse 2s infinite' : 'none',
                            }}
                          />
                        }
                        label={status}
                        size="small"
                        sx={{
                          height: 20, fontSize: '0.65rem', fontWeight: 700, borderRadius: 1.5,
                          bgcolor: isUp ? '#C8E6C9' : '#FFCDD2',
                          color: isUp ? '#2E7D32' : '#C62828',
                        }}
                      />
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        )}

        {/* Recent Deliveries Activity */}
        <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  p: 1.5, borderRadius: 3, display: 'flex',
                  background: 'linear-gradient(135deg, #6366F1 0%, #A5B4FC 100%)',
                }}
              >
                <Package size={22} color="white" />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Real-time Delivery Activity</Typography>
                <Typography variant="body2" color="text.secondary">Latest orders created by customers</Typography>
              </Box>
            </Box>
            <Chip 
              label="Live Feed" 
              color="secondary" 
              size="small" 
              sx={{ fontWeight: 700, borderRadius: 1.5 }} 
            />
          </Box>

          <Box sx={{ overflowX: 'auto' }}>
            {analytics?.recentDeliveries?.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>TRACKING #</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>CUSTOMER</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>DESTINATION</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>STATUS</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>CREATED</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentDeliveries.map((delivery, i) => (
                    <tr key={delivery.id} style={{ borderBottom: i === analytics.recentDeliveries.length - 1 ? 'none' : '1px solid #F1F5F9' }}>
                      <td style={{ padding: '16px', fontWeight: 700, color: '#1E293B' }}>#{delivery.trackingNumber}</td>
                      <td style={{ padding: '16px', color: '#475569' }}>User #{delivery.userId}</td>
                      <td style={{ padding: '16px', color: '#475569' }}>
                        {delivery.destinationAddress?.city || 'N/A'}, {delivery.destinationAddress?.state || ''}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <Box sx={{ 
                          px: 1.5, py: 0.5, borderRadius: 2, display: 'inline-flex', fontSize: '0.75rem', fontWeight: 700,
                          bgcolor: delivery.status === 'PENDING' ? '#FEF3C7' : 
                                   delivery.status === 'DELIVERED' ? '#D1FAE5' :
                                   delivery.status === 'CANCELLED' ? '#FEE2E2' : '#E0E7FF',
                          color: delivery.status === 'PENDING' ? '#92400E' : 
                                 delivery.status === 'DELIVERED' ? '#065F46' :
                                 delivery.status === 'CANCELLED' ? '#991B1B' : '#3730A3'
                        }}>
                          {delivery.status}
                        </Box>
                      </td>
                      <td style={{ padding: '16px', color: '#64748B', fontSize: '0.85rem' }}>
                        {delivery.createdAt ? new Date(delivery.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <Box sx={{ mb: 2, opacity: 0.5 }}>
                  <Activity size={48} />
                </Box>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No recent activity found
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  When customers create new deliveries, they will appear here in real-time.
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* System Maintenance */}
        <Paper 
          sx={{ 
            p: 4, mt: 5, borderRadius: 4, border: '1px solid', borderColor: '#FEE2E2',
            bgcolor: '#FFF5F5'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  p: 1.5, borderRadius: 3, display: 'flex',
                  bgcolor: '#FEE2E2',
                }}
              >
                <Trash2 size={22} color="#EF4444" />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#991B1B' }}>System Maintenance</Typography>
                <Typography variant="body2" sx={{ color: '#B91C1C' }}>Destructive actions and system cleanup tools</Typography>
              </Box>
            </Box>
            <Button 
              variant="contained" 
              color="error" 
              startIcon={<Trash2 size={18} />}
              onClick={() => setResetDialogOpen(true)}
              sx={{ borderRadius: 3, px: 3, py: 1, fontWeight: 700 }}
            >
              Reset System Data
            </Button>
          </Box>

          {resetSuccess && (
            <Alert severity="success" sx={{ mt: 3, borderRadius: 2 }} onClose={() => setResetSuccess(null)}>
              {resetSuccess}
            </Alert>
          )}
        </Paper>

        {/* Reset Confirmation Dialog */}
        <Dialog
          open={resetDialogOpen}
          onClose={() => !resetLoading && setResetDialogOpen(false)}
          PaperProps={{ sx: { borderRadius: 4, p: 1, maxWidth: 450 } }}
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'error.main', fontWeight: 800 }}>
            <AlertTriangle size={28} />
            Confirm System Reset
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
              Are you absolutely sure you want to reset the system?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              This action will:
            </Typography>
            <ul style={{ margin: 0, paddingLeft: 20, color: '#64748B', fontSize: '0.875rem' }}>
              <li>Permanently delete ALL delivery records from the database.</li>
              <li>Delete ALL customer accounts.</li>
              <li>Preserve your admin account only.</li>
              <li>This action cannot be undone.</li>
            </ul>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button 
              onClick={() => setResetDialogOpen(false)} 
              disabled={resetLoading}
              sx={{ borderRadius: 2.5, px: 3, fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="error" 
              onClick={handleResetSystem} 
              disabled={resetLoading}
              sx={{ borderRadius: 2.5, px: 3, fontWeight: 700 }}
            >
              {resetLoading ? 'Resetting...' : 'Yes, Reset Everything'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AnimatedPage>
  );
};

export default AdminDashboard;
