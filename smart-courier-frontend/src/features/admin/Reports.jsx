import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Grid, Card, CardContent, Stack, LinearProgress,
  Button, Skeleton, Alert, Divider
} from '@mui/material';
import { BarChart3, TrendingUp, Download, DollarSign, Receipt, Percent } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import AnimatedPage from '../../components/AnimatedPage';

const AdminReports = () => {
  const [analytics, setAnalytics] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [analyticsRes, revenueRes] = await Promise.all([
          axiosInstance.get('/admin/analytics/summary'),
          axiosInstance.get('/admin/reports/revenue'),
        ]);
        setAnalytics(analyticsRes.data);
        setRevenue(revenueRes.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <AnimatedPage>
        <Box>
          <Skeleton variant="text" width={300} height={48} sx={{ mb: 4 }} />
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Skeleton variant="rounded" height={400} sx={{ borderRadius: 4 }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rounded" height={400} sx={{ borderRadius: 4 }} />
            </Grid>
          </Grid>
        </Box>
      </AnimatedPage>
    );
  }

  const totalDeliveries = analytics?.totalDeliveries || 1;
  const deliveryDist = [
    { label: 'Delivered', val: analytics?.deliveredDeliveries || 0, pct: Math.round(((analytics?.deliveredDeliveries || 0) / totalDeliveries) * 100), color: '#4CAF50' },
    { label: 'Pending', val: analytics?.pendingDeliveries || 0, pct: Math.round(((analytics?.pendingDeliveries || 0) / totalDeliveries) * 100), color: '#FF9800' },
    { label: 'Cancelled', val: analytics?.cancelledDeliveries || 0, pct: Math.round(((analytics?.cancelledDeliveries || 0) / totalDeliveries) * 100), color: '#F44336' },
  ];

  return (
    <AnimatedPage>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
              Analytics & Reports
            </Typography>
            <Typography color="text.secondary">Detailed performance metrics and revenue data</Typography>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={4}>
          {/* Revenue Report */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, borderRadius: 4, height: '100%', border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)', display: 'flex' }}>
                    <DollarSign size={22} color="white" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Revenue Overview</Typography>
                </Box>
                {revenue?.currency && (
                  <Typography variant="caption" sx={{ px: 1.5, py: 0.5, borderRadius: 2, bgcolor: '#FEF3C7', fontWeight: 700, color: '#E65100' }}>
                    {revenue.currency}
                  </Typography>
                )}
              </Box>

              {revenue && (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3, borderRadius: 3, textAlign: 'center',
                        background: 'linear-gradient(135deg, rgba(0,200,83,0.06), rgba(0,200,83,0.12))',
                        border: '1px solid #C8E6C9',
                      }}
                    >
                      <DollarSign size={28} color="#2E7D32" />
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#2E7D32', mt: 1 }}>
                        {revenue.totalRevenue?.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Total Revenue</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3, borderRadius: 3, textAlign: 'center',
                        background: 'linear-gradient(135deg, rgba(255,109,0,0.06), rgba(255,109,0,0.12))',
                        border: '1px solid #FFCC80',
                      }}
                    >
                      <Receipt size={28} color="#E65100" />
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#E65100', mt: 1 }}>
                        {revenue.taxAmount?.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Tax Amount</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3, borderRadius: 3, textAlign: 'center',
                        background: 'linear-gradient(135deg, rgba(26,35,126,0.06), rgba(26,35,126,0.12))',
                        border: '1px solid #C5CAE9',
                      }}
                    >
                      <TrendingUp size={28} color="#059669" />
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#059669', mt: 1 }}>
                        {revenue.netProfit?.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Net Profit</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              )}

              <Divider sx={{ my: 4 }} />

              {/* Quick stats from analytics */}
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Success Rate</Typography>
                  <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 700 }}>
                    {totalDeliveries > 0 ? Math.round(((analytics?.deliveredDeliveries || 0) / totalDeliveries) * 100) : 0}%
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Total Shipments</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{analytics?.totalDeliveries || 0}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Active Users</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{analytics?.totalUsers || 0}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Status Distribution */}
          <Grid item xs={12} md={4}>
            <Stack spacing={4}>
              <Card sx={{ borderRadius: 4 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Status Distribution</Typography>
                    <BarChart3 size={20} color="#059669" />
                  </Box>
                  <Stack spacing={2.5}>
                    {deliveryDist.map((item, idx) => (
                      <Box key={idx}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.label}</Typography>
                          <Typography variant="body2" color="text.secondary">{item.val} ({item.pct}%)</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate" value={item.pct}
                          sx={{
                            height: 8, borderRadius: 4, bgcolor: '#F0F2F8',
                            '& .MuiLinearProgress-bar': { bgcolor: item.color, borderRadius: 4 },
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              <Paper
                sx={{
                  p: 3, borderRadius: 4, color: 'white',
                  background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                }}
              >
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Performance Insight</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.7 }}>
                  Based on current analytics, the delivery success rate is{' '}
                  <strong>
                    {totalDeliveries > 0 ? Math.round(((analytics?.deliveredDeliveries || 0) / totalDeliveries) * 100) : 0}%
                  </strong>
                  {' '}with {analytics?.totalDeliveries || 0} total shipments processed.
                  There are {analytics?.pendingDeliveries || 0} deliveries awaiting processing.
                </Typography>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </AnimatedPage>
  );
};

export default AdminReports;
