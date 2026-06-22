import {
  Box, Typography, Grid, Paper, Chip, Stack, Skeleton, Alert,
  IconButton, Tooltip, Button
} from '@mui/material';
import { Package, Clock, CheckCircle, XCircle, Plus, LayoutDashboard, Search, RefreshCcw, Truck } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import AnimatedPage from '../../components/AnimatedPage';
import StatCard from '../../components/StatCard';

const CustomerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0,
    cancelled: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchData = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const response = await axiosInstance.get(`/deliveries/user/${user?.id}`);
      const data = response.data || [];
      setDeliveries(Array.isArray(data) ? data : []);
      
      // Calculate stats
      const newStats = (Array.isArray(data) ? data : []).reduce((acc, curr) => {
        acc.total++;
        if (curr.status === 'PENDING') acc.pending++;
        else if (curr.status === 'IN_TRANSIT' || curr.status === 'OUT_FOR_DELIVERY' || curr.status === 'ASSIGNED' || curr.status === 'PICKED_UP') acc.inTransit++;
        else if (curr.status === 'DELIVERED') acc.delivered++;
        else if (curr.status === 'CANCELLED') acc.cancelled++;
        return acc;
      }, { total: 0, pending: 0, inTransit: 0, delivered: 0, cancelled: 0 });
      
      setStats(newStats);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching customer data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <AnimatedPage>
        <Box>
          <Skeleton variant="text" width={300} height={48} sx={{ mb: 4 }} />
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[1, 2, 3, 4].map(i => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Skeleton variant="rounded" height={110} sx={{ borderRadius: 4 }} />
              </Grid>
            ))}
          </Grid>
          <Skeleton variant="rounded" height={400} sx={{ borderRadius: 4 }} />
        </Box>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <Box>
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
              Welcome back, {user?.username || 'Customer'}
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography color="text.secondary">Track and manage your shipments in real-time</Typography>
              <Chip 
                label="ACTIVE" 
                size="small" 
                color="primary" 
                sx={{ 
                  height: 20, 
                  fontSize: '0.65rem', 
                  fontWeight: 900, 
                  animation: 'pulse 2s infinite' 
                }} 
              />
            </Stack>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </Typography>
              <Tooltip title="Refresh data">
                <IconButton 
                  onClick={() => fetchData(true)} 
                  disabled={refreshing}
                  size="small"
                  sx={{ 
                    bgcolor: 'background.paper', 
                    border: '1px solid', 
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <RefreshCcw size={16} className={refreshing ? 'spin' : ''} />
                </IconButton>
              </Tooltip>
            </Box>
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={() => navigate('/delivery/create')}
              sx={{ 
                borderRadius: 3, 
                px: 3, 
                py: 1, 
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)'
              }}
            >
              New Delivery
            </Button>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}

        {/* KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard label="Total Shipments" value={stats.total} icon={<Package />} bgColor="#E0F2FE" iconColor="#0284C7" delay={0} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard label="Pending Orders" value={stats.pending} icon={<Clock />} bgColor="#FEF3C7" iconColor="#D97706" delay={100} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard label="In Transit" value={stats.inTransit} icon={<Truck />} bgColor="#F0FDF4" iconColor="#16A34A" delay={200} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard label="Delivered" value={stats.delivered} icon={<CheckCircle />} bgColor="#F5F3FF" iconColor="#7C3AED" delay={300} />
          </Grid>
        </Grid>

        {/* Recent Activity Table */}
        <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  p: 1.5, borderRadius: 3, display: 'flex',
                  background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                }}
              >
                <LayoutDashboard size={22} color="white" />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Your Recent Shipments</Typography>
                <Typography variant="body2" color="text.secondary">Detailed status of your latest orders</Typography>
              </Box>
            </Box>
            <Button 
              size="small" 
              onClick={() => navigate('/customer/deliveries')}
              sx={{ fontWeight: 700 }}
            >
              View All
            </Button>
          </Box>

          <Box sx={{ overflowX: 'auto' }}>
            {deliveries.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>TRACKING #</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>DESTINATION</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>PACKAGE</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>STATUS</th>
                    <th style={{ textAlign: 'right', padding: '12px 16px', color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.slice(0, 5).map((delivery, i) => (
                    <tr key={delivery.id} style={{ borderBottom: i === 4 || i === deliveries.length - 1 ? 'none' : '1px solid #F8FAFC' }}>
                      <td style={{ padding: '16px', fontWeight: 700, color: '#1E293B' }}>#{delivery.trackingNumber}</td>
                      <td style={{ padding: '16px' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{delivery.destinationAddress?.city || 'N/A'}</Typography>
                        <Typography variant="caption" color="text.secondary">{delivery.destinationAddress?.state || ''}</Typography>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <Typography variant="body2">{delivery.pkg?.description || 'Package'}</Typography>
                        <Typography variant="caption" color="text.secondary">{delivery.pkg?.weight || 0} kg</Typography>
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
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => navigate(`/customer/track/${delivery.trackingNumber}`)}
                        >
                          <Search size={18} />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <Box sx={{ mb: 2, opacity: 0.2 }}>
                  <Package size={64} />
                </Box>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No deliveries found
                </Typography>
                <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                  Create your first shipment to see it here.
                </Typography>
                <Button variant="outlined" onClick={() => navigate('/delivery/create')} sx={{ borderRadius: 3 }}>
                  Create Delivery
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </AnimatedPage>
  );
};

export default CustomerDashboard;
