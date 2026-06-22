import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, Skeleton, Alert, Chip
} from '@mui/material';
import { Search, Package, ExternalLink, XCircle, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../../api/axiosInstance';
import AnimatedPage from '../../components/AnimatedPage';
import StatusChip from '../../components/StatusChip';

const ALL_STATUSES = ['ALL', 'PENDING', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

const MyDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [cancelDialog, setCancelDialog] = useState({ open: false, id: null });
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const fetchDeliveries = async () => {
    if (!user?.id) return;
    try {
      const response = await axiosInstance.get(`/deliveries/user/${user.id}`);
      setDeliveries(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch deliveries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDeliveries(); }, [user?.id]);

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      await axiosInstance.put(`/deliveries/${cancelDialog.id}/cancel`);
      setCancelDialog({ open: false, id: null });
      fetchDeliveries();
    } catch (err) {
      setError(err.message || 'Failed to cancel delivery');
    } finally {
      setCancelLoading(false);
    }
  };

  const filteredDeliveries = deliveries.filter(d => {
    const matchesSearch = !searchTerm ||
      d.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.destinationAddress?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.pkg?.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AnimatedPage>
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
            My Deliveries
          </Typography>
          <Typography color="text.secondary">Manage and track your shipment history</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}

        {/* Filters */}
        <Paper
          sx={{
            mb: 3, p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider',
            display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center',
          }}
        >
          <TextField
            placeholder="Search by tracking #, city, or description..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1, minWidth: 250, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search size={18} color="#68769F" /></InputAdornment>,
            }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel><Filter size={14} style={{ marginRight: 4 }} />Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ borderRadius: 3 }}
            >
              {ALL_STATUSES.map((s) => (
                <MenuItem key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s.replace(/_/g, ' ')}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        {/* Summary chips */}
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label={`${filteredDeliveries.length} result${filteredDeliveries.length !== 1 ? 's' : ''}`} size="small" sx={{ fontWeight: 600 }} />
          {statusFilter !== 'ALL' && (
            <Chip label={statusFilter.replace(/_/g, ' ')} size="small" color="primary" onDelete={() => setStatusFilter('ALL')} />
          )}
        </Box>

        {/* Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tracking ID</TableCell>
                <TableCell>Destination</TableCell>
                <TableCell>Package</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}><Skeleton variant="text" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredDeliveries.length > 0 ? (
                filteredDeliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell sx={{ fontWeight: 700 }}>#{delivery.trackingNumber}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {delivery.destinationAddress?.city || '—'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {delivery.destinationAddress?.street || ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{delivery.pkg?.description || '—'}</Typography>
                      {delivery.pkg?.weight && (
                        <Typography variant="caption" color="text.secondary">{delivery.pkg.weight} kg</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {delivery.createdAt ? new Date(delivery.createdAt).toLocaleDateString() : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={delivery.status} />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                        <IconButton
                          color="primary" size="small"
                          onClick={() => navigate(`/customer/track/${delivery.trackingNumber}`)}
                          title="Track"
                        >
                          <ExternalLink size={18} />
                        </IconButton>
                        {!['DELIVERED', 'CANCELLED'].includes(delivery.status) && (
                          <IconButton
                            color="error" size="small"
                            onClick={() => setCancelDialog({ open: true, id: delivery.id })}
                            title="Cancel"
                          >
                            <XCircle size={18} />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 8 }}>
                    <Package size={48} color="#C1C9E4" style={{ marginBottom: 16 }} />
                    <Typography color="text.secondary">No shipments found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Cancel Dialog */}
        <Dialog
          open={cancelDialog.open}
          onClose={() => setCancelDialog({ open: false, id: null })}
          PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Cancel Delivery?</DialogTitle>
          <DialogContent>
            <Typography color="text.secondary">
              This action cannot be undone. The delivery will be marked as cancelled.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setCancelDialog({ open: false, id: null })}>Keep Delivery</Button>
            <Button
              variant="contained" color="error" onClick={handleCancel}
              disabled={cancelLoading}
            >
              {cancelLoading ? 'Cancelling...' : 'Yes, Cancel It'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AnimatedPage>
  );
};

export default MyDeliveries;
