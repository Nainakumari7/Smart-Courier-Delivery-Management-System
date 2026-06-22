import React, { useEffect, useState } from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

const StatCard = ({ label, value, icon, bgColor = '#D1FAE5', iconColor = '#059669', delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const numVal = typeof value === 'number' ? value : parseInt(value, 10);
    if (isNaN(numVal)) {
      setDisplayValue(value);
      return;
    }
    if (numVal === 0) { setDisplayValue(0); return; }

    let start = 0;
    const duration = 800;
    const steps = 30;
    const increment = numVal / steps;
    const stepTime = duration / steps;

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        start += increment;
        if (start >= numVal) {
          setDisplayValue(numVal);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, stepTime);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <Card
      sx={{
        borderRadius: 4,
        overflow: 'visible',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 12px 32px rgba(27,37,89,0.1)',
          borderColor: 'primary.light',
        },
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3, '&:last-child': { pb: 3 } }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: bgColor,
            mr: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 54,
            minHeight: 54,
            boxShadow: `0 8px 16px ${bgColor}80`,
          }}
        >
          {React.cloneElement(icon, { color: iconColor, size: 28 })}
        </Box>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, letterSpacing: '0.02em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
            {label}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1, color: 'text.primary' }}>
            {displayValue}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
