import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Matches backend DeliveryRequest DTO shape
  currentDelivery: {
    userId: null,
    pkg: { description: '', weight: '', length: '', width: '', height: '' },
    originAddress: { street: '', city: '', state: '', zipCode: '', country: '' },
    destinationAddress: { street: '', city: '', state: '', zipCode: '', country: '' },
  },
  myDeliveries: [],
  loading: false,
  error: null,
};

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    updateOriginAddress: (state, action) => {
      state.currentDelivery.originAddress = { ...state.currentDelivery.originAddress, ...action.payload };
    },
    updateDestinationAddress: (state, action) => {
      state.currentDelivery.destinationAddress = { ...state.currentDelivery.destinationAddress, ...action.payload };
    },
    updatePackage: (state, action) => {
      state.currentDelivery.pkg = { ...state.currentDelivery.pkg, ...action.payload };
    },
    setUserId: (state, action) => {
      state.currentDelivery.userId = action.payload;
    },
    resetDelivery: (state) => {
      state.currentDelivery = initialState.currentDelivery;
    },
    setMyDeliveries: (state, action) => {
      state.myDeliveries = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  updateOriginAddress,
  updateDestinationAddress,
  updatePackage,
  setUserId,
  resetDelivery,
  setMyDeliveries,
  setLoading,
  setError,
} = deliverySlice.actions;

export default deliverySlice.reducer;
