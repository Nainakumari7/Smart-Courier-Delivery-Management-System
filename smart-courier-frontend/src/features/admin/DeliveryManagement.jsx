import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, Button, InputAdornment, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Alert, MenuItem, Select, FormControl, InputLabel, Dialog,
  DialogTitle, DialogContent, DialogActions, Stack, Chip, Divider
} from '@mui/material';
import { Search, Filter, Eye, Truck, UserCheck, RefreshCw } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import AnimatedPage from '../../components/AnimatedPage';
import StatusChip from '../../components/StatusChip';

const ALL_STATUSES = ['', 'PENDING', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
const UPDATABLE_STATUSES = ['PENDING', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

const DeliveryManagement = () => {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);


  const [statusDialog, setStatusDialog] = useState({ open: false, deliveryId: null, currentStatus: '' });
  const [newStatus, setNewStatus] = useState('');
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  
  const [agentDialog, setAgentDialog] = useState({ open: false, deliveryId: null });
  const [agentId, setAgentId] = useState('');
  const [agentLoading, setAgentLoading] = useState(false);

  // Detail dialog
  const [detailDialog, setDetailDialog] = useState({ open: false, delivery: null });

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (statusFilter) params.append('status', statusFilter);
      const response = await axiosInstance.get(`/deliveries/search?${params.toString()}`);
      setResults(response.data);
    } catch (err) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    setStatusUpdateLoading(true);
    try {
      await axiosInstance.put(`/deliveries/${statusDialog.deliveryId}/status`, { status: newStatus });
      setSuccess('Delivery status updated successfully');
      setStatusDialog({ open: false, deliveryId: null, currentStatus: '' });
      handleSearch(); // Refresh
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleAgentAssign = async () => {
    setAgentLoading(true);
    try {
      await axiosInstance.put(`/deliveries/${agentDialog.deliveryId}/assign`, { agentId: parseInt(agentId) });
      setSuccess('Agent assigned successfully');
      setAgentDialog({ open: false, deliveryId: null });
      setAgentId('');
      handleSearch(); // Refresh
    } catch (err) {
      setError(err.message || 'Failed to assign agent');
    } finally {
      setAgentLoading(false);
    }
  };

  const viewDeliveryDetail = async (id) => {
    try {
      const response = await axiosInstance.get(`/deliveries/${id}`);
      setDetailDialog({ open: true, delivery: response.data });
    } catch (err) {
      setError(err.message || 'Failed to load delivery details');
    }
  };

  return (
    <AnimatedPage>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
          Delivery Management
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>Search, update, and manage all deliveries</Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>{success}</Alert>}

        {/* Search Bar */}
        <Paper
          component="form"
          onSubmit={handleSearch}
          sx={{
            p: 2.5, mb: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider',
            display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center',
          }}
        >
          <TextField
            placeholder="Search by tracking #, customer ID..."
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ flex: 1, minWidth: 220, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search size={18} color="#68769F" /></InputAdornment>,
            }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={statusFilter}
              label="Status Filter"
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ borderRadius: 3 }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              {ALL_STATUSES.filter(Boolean).map((s) => (
                <MenuItem key={s} value={s}>{s.replace(/_/g, ' ')}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" disabled={loading} sx={{ px: 4, borderRadius: 3 }}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </Paper>

        {/* Results Count */}
        {results.length > 0 && (
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip label={`${results.length} result${results.length !== 1 ? 's' : ''}`} size="small" sx={{ fontWeight: 600 }} />
            <Button size="small" startIcon={<RefreshCw size={14} />} onClick={handleSearch}>Refresh</Button>
          </Box>
        )}

        {/* Results Table */}
        {results.length > 0 && (
          <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tracking #</TableCell>
                  <TableCell>User ID</TableCell>
                  <TableCell>Destination</TableCell>
                  <TableCell>Package</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Agent</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell sx={{ fontWeight: 700 }}>#{delivery.trackingNumber}</TableCell>
                    <TableCell>#{delivery.userId}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {delivery.destinationAddress?.city || '—'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {delivery.destinationAddress?.state || ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{delivery.pkg?.description || '—'}</Typography>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={delivery.status} />
                    </TableCell>
                    <TableCell>
                      {delivery.agentId ? `#${delivery.agentId}` : '—'}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Button
                          size="small" startIcon={<Eye size={14} />}
                          onClick={() => viewDeliveryDetail(delivery.id)}
                        >
                          View
                        </Button>
                        <Button
                          size="small" startIcon={<Truck size={14} />} color="primary"
                          onClick={() => {
                            setStatusDialog({ open: true, deliveryId: delivery.id, currentStatus: delivery.status });
                            setNewStatus(delivery.status);
                          }}
                        >
                          Status
                        </Button>
                        <Button
                          size="small" startIcon={<UserCheck size={14} />} color="secondary"
                          onClick={() => setAgentDialog({ open: true, deliveryId: delivery.id })}
                        >
                          Assign
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {results.length === 0 && !loading && (
          <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
            <Search size={48} color="#C1C9E4" style={{ marginBottom: 16 }} />
            <Typography variant="h6" color="text.secondary">Search for deliveries</Typography>
            <Typography variant="body2" color="text.secondary">
              Use the search bar above to find deliveries by tracking number or filter by status.
            </Typography>
          </Paper>
        )}

        {/* Status Update Dialog */}
        <Dialog
          open={statusDialog.open}
          onClose={() => setStatusDialog({ open: false, deliveryId: null, currentStatus: '' })}
          PaperProps={{ sx: { borderRadius: 4, p: 1, minWidth: 400 } }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Update Delivery Status</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Current status: <strong>{statusDialog.currentStatus?.replace(/_/g, ' ')}</strong>
            </Typography>
            <FormControl fullWidth>
              <InputLabel>New Status</InputLabel>
              <Select value={newStatus} label="New Status" onChange={(e) => setNewStatus(e.target.value)}>
                {UPDATABLE_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>{s.replace(/_/g, ' ')}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setStatusDialog({ open: false, deliveryId: null, currentStatus: '' })}>Cancel</Button>
            <Button variant="contained" onClick={handleStatusUpdate} disabled={statusUpdateLoading}>
              {statusUpdateLoading ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Agent Assignment Dialog */}
        <Dialog
          open={agentDialog.open}
          onClose={() => setAgentDialog({ open: false, deliveryId: null })}
          PaperProps={{ sx: { borderRadius: 4, p: 1, minWidth: 400 } }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Assign Delivery Agent</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enter the agent ID to assign to this delivery.
            </Typography>
            <TextField
              fullWidth label="Agent ID" type="number" margin="normal"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setAgentDialog({ open: false, deliveryId: null })}>Cancel</Button>
            <Button variant="contained" color="secondary" onClick={handleAgentAssign} disabled={agentLoading || !agentId}>
              {agentLoading ? 'Assigning...' : 'Assign Agent'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Detail View Dialog */}
        <Dialog
          open={detailDialog.open}
          onClose={() => setDetailDialog({ open: false, delivery: null })}
          maxWidth="sm" fullWidth
          PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Delivery Details</DialogTitle>
          <DialogContent>
            {detailDialog.delivery && (
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>#{detailDialog.delivery.trackingNumber}</Typography>
                  <StatusChip status={detailDialog.delivery.status} />
                </Box>
                <Divider />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">User ID</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>#{detailDialog.delivery.userId}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Agent ID</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{detailDialog.delivery.agentId ? `#${detailDialog.delivery.agentId}` : 'Unassigned'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Origin</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {detailDialog.delivery.originAddress?.city}, {detailDialog.delivery.originAddress?.state}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Destination</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {detailDialog.delivery.destinationAddress?.city}, {detailDialog.delivery.destinationAddress?.state}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Package</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{detailDialog.delivery.pkg?.description || '—'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Weight</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{detailDialog.delivery.pkg?.weight ? `${detailDialog.delivery.pkg.weight} kg` : '—'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Created</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {detailDialog.delivery.createdAt ? new Date(detailDialog.delivery.createdAt).toLocaleString() : '—'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Last Updated</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {detailDialog.delivery.updatedAt ? new Date(detailDialog.delivery.updatedAt).toLocaleString() : '—'}
                    </Typography>
                  </Grid>
                </Grid>
              </Stack>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDetailDialog({ open: false, delivery: null })}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AnimatedPage>
  );
};

export default DeliveryManagement;
