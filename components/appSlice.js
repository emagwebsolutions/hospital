import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  desc: '',
  lat: 5.5607445,
  lng: -0.1872202,
  vicinity: '',
  orig: '',
  miles: '',
  time: '',
};

const appslice = createSlice({
  name: 'appslice',
  initialState,
  reducers: {
    hospitalCordinates: (state, { payload }) => {
      state.desc = payload.desc;
      state.lat = payload.lat ;
      state.lng = payload.lng ;
      state.vicinity = payload.vicinity;
    },
    userCurrentLoc: (state, { payload }) => {
      state.orig = payload;
    },
    milesTime: (state, { payload }) => {
      state.miles = payload.miles;
      state.time = payload.time;
    },
  },
});

export const { hospitalCordinates, userCurrentLoc, milesTime } =
  appslice.actions;


export const userCurrentLocFunc = (state) => state.app.orig;


export default appslice.reducer;

