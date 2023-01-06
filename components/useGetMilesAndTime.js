import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import apiKey from '../config';
import {
  hospitalCordinatesFunc,
  userCurrentLocFunc,
  milesTimeFunc,
} from './appSlice';

const useGetMilesAndTime = () => {
  const dispatch = useDispatch();
  const hc = useSelector(hospitalCordinatesFunc);
  const orig = useSelector(userCurrentLocFunc);

  console.log(orig)

  useEffect(() => {
    if (!orig) return;
    const getTravelTime = async () => {
      try {
        const obj = await fetch(
          `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${hc.orig}&destinations=${hc.vicinity}&key=${apiKey.key}`
        );
        const data = await obj.json();
        console.log(data);
        const dist = data.rows[0].elements[0];

        if (dist) {
          //DISPATCH miles and distance
          dispatch(
            milesTimeFunc({
              miles: dist?.distance.text,
              time: dist?.duration.text,
            })
          );
        }

        //
      } catch (err) {
        console.log(err);
      }
    };

    getTravelTime();
  }, [orig]);
};

export default useGetMilesAndTime;
