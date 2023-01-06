import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Location from 'expo-location';
import nearbPlaces from '../utils/nearbPlaces';
import { ascendingSort } from '../utils/nearbPlaces';
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
              const arr = Object.values(data).map((v) => v.cordinates);
              const sort = ascendingSort(arr)[0];

              //DISPATCH hospital latitude and longitued
              dispatch(hospitalCordinates(sort));
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
        console.log(err.message);
        console.log('Access denied');
      }
    };

    accessLocation();
  }, []);
};

export default useAccessdevicelocation;
