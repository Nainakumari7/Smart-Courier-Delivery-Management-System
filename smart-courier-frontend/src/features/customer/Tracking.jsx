import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Divider, Stack, CircularProgress, Alert,
  Button, Grid, Card, CardContent
} from '@mui/material';
import { Package, Truck, MapPin, CheckCircle, Clock, ChevronLeft, Navigation } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import AnimatedPage from '../../components/AnimatedPage';
import StatusChip from '../../components/StatusChip';

const Tracking = () => {
  const { id } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [trackingEvents, setTrackingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        // Fetch delivery details by tracking number
        const deliveryRes = await axiosInstance.get(`/deliveries/tracking/${id}`);
        setDelivery(deliveryRes.data);

        // Fetch tracking event history
        try {
          const trackingRes = await axiosInstance.get(`/tracking/${id}`);
          setTrackingEvents(Array.isArray(trackingRes.data) ? trackingRes.data : [trackingRes.data]);
        } catch {
          // Tracking events may not exist yet — that's OK
          setTrackingEvents([]);
        }
      } catch (err) {
        setError('Tracking information not found. Please check your tracking number.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrackingData();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <AnimatedPage>
      <Box>
        <Button startIcon={<ChevronLeft size={18} />} onClick={() => navigate(-1)} sx={{ mb: 3, fontWeight: 600 }}>
          Back
        </Button>

        {error ? (
          <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>
        ) : (
          <Grid container spacing={4}>
            {/* Main tracking panel */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography variant="overline" color="text.secondary">Tracking Number</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                      {delivery.trackingNumber}
                    </Typography>
                  </Box>
                  <StatusChip status={delivery.status} size="medium" />
                </Box>

                {/* Route summary */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3, borderRadius: 3, mb: 4,
                    background: 'linear-gradient(135deg, rgba(26,35,126,0.03) 0%, rgba(83,75,174,0.06) 100%)',
                    border: '1px solid', borderColor: 'divider',
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={5}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>FROM</Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {delivery.originAddress?.city || '—'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {[delivery.originAddress?.street, delivery.originAddress?.state, delivery.originAddress?.zipCode].filter(Boolean).join(', ')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2} sx={{ textAlign: 'center' }}>
                      <Navigation size={24} color="#534BAE" style={{ transform: 'rotate(90deg)' }} />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>TO</Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {delivery.destinationAddress?.city || '—'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {[delivery.destinationAddress?.street, delivery.destinationAddress?.state, delivery.destinationAddress?.zipCode].filter(Boolean).join(', ')}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                <Divider sx={{ my: 3 }} />

                {/* Tracking Events Timeline */}
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                  {trackingEvents.length > 0 ? 'Tracking History' : 'Journey Timeline'}
                </Typography>

                {trackingEvents.length > 0 ? (
                  <Stack spacing={0}>
                    {trackingEvents
                      .sort((a, b) => new Date(b.eventTime) - new Date(a.eventTime))
                      .map((event, idx) => (
                        <Box key={idx} sx={{ display: 'flex', gap: 3 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box
                              sx={{
                                width: 28, height: 28, borderRadius: '50%', zIndex: 1,
                                bgcolor: idx === 0 ? 'primary.main' : '#E0E5F2',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: idx === 0 ? '0 0 0 4px rgba(26,35,126,0.15)' : 'none',
                              }}
                            >
                              {idx === 0 && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'white' }} />}
                            </Box>
                            {idx !== trackingEvents.length - 1 && (
                              <Box sx={{ width: 2, flexGrow: 1, bgcolor: idx === 0 ? 'primary.main' : '#E0E5F2', my: 0.5, minHeight: 40 }} />
                            )}
                          </Box>
                          <Box sx={{ pb: 3, flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: idx === 0 ? 'primary.main' : 'text.primary' }}>
                              {event.status?.replace(/_/g, ' ')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">{event.description}</Typography>
                            <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                              {event.location && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <MapPin size={12} /> {event.location}
                                </Typography>
                              )}
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Clock size={12} /> {event.eventTime ? new Date(event.eventTime).toLocaleString() : '—'}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                  </Stack>
                ) : (
                  /* Fallback: show status-based timeline from delivery data */
                  <Stack spacing={0}>
                    {[
                      { status: 'Delivered', active: delivery.status === 'DELIVERED', time: delivery.status === 'DELIVERED' ? delivery.updatedAt : null },
                      { status: 'Out for Delivery', active: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(delivery.status), time: delivery.status === 'OUT_FOR_DELIVERY' ? delivery.updatedAt : null },
                      { status: 'In Transit', active: ['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(delivery.status), time: delivery.status === 'IN_TRANSIT' ? delivery.updatedAt : null },
                      { status: 'Picked Up', active: ['PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(delivery.status), time: delivery.status === 'PICKED_UP' ? delivery.updatedAt : null },
                      { status: 'Order Placed', active: true, time: delivery.createdAt },
                    ].map((event, idx, arr) => (
                      <Box key={idx} sx={{ display: 'flex', gap: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 24, height: 24, borderRadius: '50%', zIndex: 1,
                              bgcolor: event.active ? 'primary.main' : '#E0E5F2',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                          >
                            {event.active && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'white' }} />}
                          </Box>
                          {idx !== arr.length - 1 && (
                            <Box sx={{ width: 2, flexGrow: 1, bgcolor: event.active ? 'primary.main' : '#E0E5F2', my: 0.5, minHeight: 32 }} />
                          )}
                        </Box>
                        <Box sx={{ pb: 3 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: event.active ? 'text.primary' : 'text.disabled' }}>
                            {event.status}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {event.time ? new Date(event.time).toLocaleString() : 'Pending'}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Paper>
            </Grid>

            {/* Sidebar details */}
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                {/* Package info */}
                <Card sx={{ borderRadius: 4 }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                      Package Details
                    </Typography>
                    <Stack spacing={1.5} sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Description</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{delivery.pkg?.description || '—'}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Weight</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{delivery.pkg?.weight ? `${delivery.pkg.weight} kg` : '—'}</Typography>
                      </Box>
                      {delivery.pkg?.length && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Dimensions</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {delivery.pkg.length} × {delivery.pkg.width} × {delivery.pkg.height} cm
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>

                {/* Timing card */}
                <Card sx={{ borderRadius: 4, bgcolor: '#F8F9FF', border: '1px dashed', borderColor: '#C7D2FE' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                      Delivery Info
                    </Typography>
                    <Stack spacing={1.5} sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Created</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {delivery.createdAt ? new Date(delivery.createdAt).toLocaleDateString() : '—'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {delivery.updatedAt ? new Date(delivery.updatedAt).toLocaleDateString() : '—'}
                        </Typography>
                      </Box>
                      {delivery.estimatedDeliveryTime && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Est. Delivery</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                            {new Date(delivery.estimatedDeliveryTime).toLocaleDateString()}
                          </Typography>
                        </Box>
                      )}
                      {delivery.agentId && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Agent ID</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>#{delivery.agentId}</Typography>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        )}
      </Box>
    </AnimatedPage>
  );
};

export default Tracking;
