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
      state.desck = payload.desc;
      state.lat = payload.lat ? payload.lat : state.lat;
      state.lng = payload.lng ? payload.lng : state.lng;
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

export const hospitalCordinatesFunc = (state) => state.app;
export const userCurrentLocFunc = (state) => state.app.orig;
export const milesTimeFunc = (state) => state.app;

export default appslice.reducer;

