import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as Location from 'expo-location';
import nearbPlaces from '../utils/nearbPlaces';
import { hospitalCordinates, userCurrentLoc } from './appSlice';
import apiKey from '../config';

useAccessdevicelocation = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const accessLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
        }

        Location.setGoogleApiKey(apiKey.key);

        let { coords } = await Location.getCurrentPositionAsync();

        if (coords) {
          let { longitude, latitude } = coords;

          if ((longitude, latitude)) {
            const obj = {
              latitude,
              longitude,
            };
            nearbPlaces(obj, (data) => {
              const arr = Object.values(data).map((v) => {
                if (v) {
                  return v;
                }
              });

              //DISPATCH hospital latitude and longitued
              dispatch(hospitalCordinates(arr));
            });
          }

          let regionName = await Location.reverseGeocodeAsync({
            longitude,
            latitude,
          });

          const street = regionName[0].street;
          const city = regionName[0].country + ', ' + regionName[0].city;
          const curloc = street || city;

          //DISPACH user current location
          dispatch(userCurrentLoc(curloc));
        }
      } catch (err) {
        dispatch(
          hospitalCordinates({
            desc: 'Enter a location!',
            lat: 5.5607445,
            lng: -0.1872202,
            vicinity: '',
          })
        );
      }
    };

    accessLocation();
  }, []);
};

export default useAccessdevicelocation;
