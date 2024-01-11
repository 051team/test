import { configureStore } from '@reduxjs/toolkit';
import loginSlice from './loginSlice';

export const bank = configureStore({
  reducer: {
    loginSlice: loginSlice,
  },
})