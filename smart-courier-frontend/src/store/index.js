import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import deliveryReducer from './deliverySlice';
import adminReducer from './adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    delivery: deliveryReducer,
    admin: adminReducer,
  },
});

export default store;
