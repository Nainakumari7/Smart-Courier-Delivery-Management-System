import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  analytics: null,   // AnalyticsSummary
  revenue: null,     // RevenueReport
  health: null,      // System health map
  searchResults: [], // Delivery search results
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAnalytics: (state, action) => {
      state.analytics = action.payload;
    },
    setRevenue: (state, action) => {
      state.revenue = action.payload;
    },
    setHealth: (state, action) => {
      state.health = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setAdminLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAdminError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setAnalytics,
  setRevenue,
  setHealth,
  setSearchResults,
  setAdminLoading,
  setAdminError,
} = adminSlice.actions;

export default adminSlice.reducer;
