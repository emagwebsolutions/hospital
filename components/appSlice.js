import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hospitalsLocations: '',
  orig: '',
  miletime: {
    mile: '',
    time: ''
  }
};

const appslice = createSlice({
  name: 'appslice',
  initialState,
  reducers: {
    hospitalCordinates: (state, { payload }) => {
      state.hospitalsLocations = payload;
    },
    userCurrentLoc: (state, { payload }) => {
      state.orig = payload;
    },
    mileTime: (state, {payload})=>{
      state.miletime = payload
    }
  },
});

export const { hospitalCordinates, userCurrentLoc,mileTime } =
  appslice.actions;

export const userCurrentLocFunc = (state) => state.app.orig;
export const mileTimeFunc = (state) => state.app.miletime;
export const hospitalCordinatesFunc = (state) => state.app.hospitalsLocations;

export default appslice.reducer;
