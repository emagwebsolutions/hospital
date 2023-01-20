import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hospitalsLocations: '',
  orig: '',
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
  },
});

export const { hospitalCordinates, userCurrentLoc } =
  appslice.actions;

export const userCurrentLocFunc = (state) => state.app.orig;
export const hospitalCordinatesFunc = (state) => state.app.hospitalsLocations;

export default appslice.reducer;
