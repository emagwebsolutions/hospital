import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import nearbPlaces, { ascendingSort } from '../utils/nearbPlaces';
import Map from './Map';
import apiKey from '../config';
import { useSelector, useDispatch } from 'react-redux';
import {
  hospitalCordinatesFunc,
  userCurrentLocFunc,
  milesTimeFunc,
} from './appSlice';
import useGetMilesAndTime from './useGetMilesAndTime';
import useAccessdevicelocation from './useAccessdevicelocation';


export default function Main() {
  const getCord = useSelector(hospitalCordinatesFunc)
  const orig = useSelector(userCurrentLocFunc)
  const milesTime = useSelector(milesTimeFunc)
  const dispatch = useDispatch()

  const getMyCurrentLoc = orig || 'Choose your current location'
  
  useAccessdevicelocation()

  useGetMilesAndTime()

  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.mapbox}>


          <Map
            latitude={getCord.lat}
            longitude={getCord.lng}
            desc={getCord.desc}
            vicinity={getCord.vicinity}
            orig={orig}
          />


        </View>
        <View style={styles.infobox}>
          <View style={styles.title}>
            <Text>MY HEALTH LOCATOR</Text>
          </View>
          <View style={{ paddingHorizontal: 20 }}>



            <GooglePlacesAutocomplete
              placeholder={getMyCurrentLoc}
              styles={{
                container: {
                  flex: 0,
                },
                textInput: {
                  fontSize: 18,
                  backgroundColor: '#DDDDDF',
                  borderRadius: 0,
                },
              }}
              onPress={(data, details = null) => {
                const { lat, lng } = details.geometry.location;

                const obj = {
                  latitude: lat,
                  longitude: lng,
                };
                nearbPlaces(obj, (data) => {
                  const arr = Object.values(data).map((v) => v.cordinates);
                  const sort = ascendingSort(arr)[0];

                  //DISPATCH hospital latitudes and longitues
                  dispatch(hospitalCordinatesFunc(sort))
                  
                });
                //DISPATCH user current location
                dispatch(userCurrentLocFunc(data.description));
              }}
              fetchDetails={true}
              returnKeyType="search"
              enablePoweredByContainer={false}
              minLength={2}
              query={{
                key: apiKey.key,
                language: 'en',
              }}
              nearbyPlacesAPI="GooglePlacesSearch"
              debounce={400}
            />



          </View>
          <View style={styles.km}>


            <Text>Miles: {milesTime.miles}</Text>
            <Text>Est Time: {milesTime.time}</Text>


          </View>
          <View style={styles.results}>


            <Text>{getCord.desc || 'Loading.....'}</Text>


          </View>
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapbox: {
    height: '60%',
  },
  infobox: {
    height: '40%',
    backgroundColor: '#fff',
  },
  title: {
    flex: 0,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
    fontSize: 30,
  },
  km: {
    flex: 0,
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 11,
    fontSize: 22,
  },
  results: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 33,
    alignItems: 'center',
  },
});
