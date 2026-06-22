import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#059669', light: '#34D399', dark: '#047857', contrastText: '#fff' },
          secondary: { main: '#F59E0B', light: '#FBBF24', dark: '#D97706', contrastText: '#fff' },
          success: { main: '#10B981', light: '#6EE7B7', dark: '#059669' },
          warning: { main: '#F59E0B', light: '#FCD34D', dark: '#D97706' },
          error: { main: '#EF4444', light: '#F87171', dark: '#DC2626' },
          info: { main: '#3B82F6', light: '#93C5FD', dark: '#2563EB' },
          background: { default: '#F8FAFC', paper: '#FFFFFF' },
          text: { primary: '#0F172A', secondary: '#64748B' },
          divider: '#E2E8F0',
        }
      : {
          primary: { main: '#10B981', light: '#34D399', dark: '#059669', contrastText: '#fff' },
          secondary: { main: '#FBBF24', light: '#FCD34D', dark: '#F59E0B', contrastText: '#1E293B' },
          success: { main: '#34D399', light: '#6EE7B7', dark: '#10B981' },
          warning: { main: '#FBBF24', light: '#FCD34D', dark: '#F59E0B' },
          error: { main: '#F87171', light: '#FCA5A5', dark: '#EF4444' },
          info: { main: '#60A5FA', light: '#93C5FD', dark: '#3B82F6' },
          background: { default: '#0F172A', paper: '#1E293B' },
          text: { primary: '#F8FAFC', secondary: '#94A3B8' },
          divider: '#334155',
        }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, fontSize: '2.5rem', letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.01em' },
    h4: { fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.01em' },
    h5: { fontWeight: 700, fontSize: '1.25rem' },
    h6: { fontWeight: 700, fontSize: '1.1rem' },
    subtitle1: { fontWeight: 600, fontSize: '1rem' },
    subtitle2: { fontWeight: 600, fontSize: '0.875rem' },
    body1: { fontSize: '0.95rem', lineHeight: 1.6 },
    body2: { fontSize: '0.85rem', lineHeight: 1.6 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
    overline: { fontWeight: 700, letterSpacing: '0.08em', fontSize: '0.7rem' },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 24px',
          borderRadius: 12,
          boxShadow: 'none',
          transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          border: `1px solid ${theme.palette.divider}`,
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        elevation0: ({ theme }) => ({
          boxShadow: 'none',
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.2s ease',
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 2 },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: ({ theme }) => ({
          fontWeight: 700,
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.mode === 'light' ? '#F1F5F9' : '#334155',
          borderBottom: `2px solid ${theme.palette.divider}`,
        }),
        body: ({ theme }) => ({
          borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#F8FAFC' : '#0F172A'}`,
        }),
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: ({ theme }) => ({
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC !important' : '#334155 !important',
          },
        }),
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12, fontWeight: 500 },
      },
    },
  },
});

export const createAppTheme = (mode) => createTheme(getDesignTokens(mode));

