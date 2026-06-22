import React from 'react';
import { Chip } from '@mui/material';
import { Clock, Truck, Package, CheckCircle, XCircle, UserCheck, MapPin } from 'lucide-react';

const STATUS_MAP = {
  PENDING: { label: 'Pending', color: 'warning', icon: <Clock size={14} /> },
  PICKED_UP: { label: 'Picked Up', color: 'info', icon: <Package size={14} /> },
  IN_TRANSIT: { label: 'In Transit', color: 'info', icon: <Truck size={14} /> },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: 'primary', icon: <MapPin size={14} /> },
  DELIVERED: { label: 'Delivered', color: 'success', icon: <CheckCircle size={14} /> },
  CANCELLED: { label: 'Cancelled', color: 'error', icon: <XCircle size={14} /> },
  ASSIGNED: { label: 'Assigned', color: 'secondary', icon: <UserCheck size={14} /> },
};

const StatusChip = ({ status, size = 'small', ...props }) => {
  const config = STATUS_MAP[status] || { label: status, color: 'default', icon: <Package size={14} /> };

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color}
      size={size}
      sx={{ fontWeight: 700, borderRadius: 2, px: 0.5, ...props.sx }}
      {...props}
    />
  );
};

export default StatusChip;
