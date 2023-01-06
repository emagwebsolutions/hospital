import { configureStore } from '@reduxjs/toolkit';
import appsliceReducer from './appSlice';

const store = configureStore({
  reducer: {
    app: appsliceReducer,
  },
});

export default store;
