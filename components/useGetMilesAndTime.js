import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import apiKey from '../config';
import { userCurrentLocFunc, milesTime } from './appSlice';

const useGetMilesAndTime = () => {
  const dispatch = useDispatch();

  const orig = useSelector(userCurrentLocFunc);
  const vicinity = useSelector((state) => state.app.vicinity);
  useEffect(() => {
    const getTravelTime = async () => {
      try {
        const obj = await fetch(
          `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${orig}&destinations=${vicinity}&key=${apiKey.key}`
        );
        const data = await obj.json();

        if (data) {
          if (data?.rows[0]) {
            const dist = data.rows[0].elements[0];

            if (dist) {
              //DISPATCH miles and distance
              dispatch(
                milesTime({
                  miles: dist?.distance.text,
                  time: dist?.duration.text,
                })
              );
            }
          }
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    getTravelTime();
  }, [orig, vicinity]);
};

export default useGetMilesAndTime;
