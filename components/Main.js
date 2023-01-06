import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import nearbPlaces, { ascendingSort } from '../utils/nearbPlaces';

import apiKey from '../config';
import { useSelector, useDispatch } from 'react-redux';
import {
  userCurrentLocFunc,
  userCurrentLoc,
  hospitalCordinates
} from './appSlice';
import useGetMilesAndTime from './useGetMilesAndTime';
import useAccessdevicelocation from './useAccessdevicelocation';

import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useRef, useEffect } from 'react';







export default function Main() {



  const Map = () => {
    const desc = useSelector((state)=> state.app.desc)
    const lat  = useSelector((state)=> state.app.lat)
    const lng  = useSelector((state)=> state.app.lng)
    const vicinity  = useSelector((state)=> state.app.vicinity)
    const orig = useSelector((state)=> state.app.orig)
  
  
  
    const mapRef = useRef(null);
  
    useEffect(() => {
      if ((!orig, !vicinity)) return;
  
      //Zoom
      mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      });
    }, [orig, vicinity, lat, lng]);
  
    return (
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        mapType="mutedStandard"
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        {orig && vicinity &&  (
          <MapViewDirections
            origin={orig}
            destination={vicinity}
            apikey={apiKey.key}
            strokeWidth={3}
            strokeColor="black"
          />
        )}
  
        {orig && vicinity && (
          <Marker
            coordinate={{
              latitude: lat,
              longitude: lng,
            }}
            title="Destination"
            description={desc}
            identifier="destination"
          />
        )}
      </MapView>
    );
  };







  useAccessdevicelocation()

  useGetMilesAndTime()




















  const desc = useSelector((state)=> state.app.desc)
  const lat  = useSelector((state)=> state.app.lat)
  const lng  = useSelector((state)=> state.app.lng)
  const vicinity  = useSelector((state)=> state.app.vicinity)
  const orig = useSelector(userCurrentLocFunc)

  const miles = useSelector((state)=> state.app.miles)
  const time = useSelector((state)=> state.app.time)
  const dispatch = useDispatch()



  const getMyCurrentLoc = orig || 'Choose your current location'
  


  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.mapbox}>


          <Map
            latitude={lat}
            longitude={lng}
            desc={desc}
            vicinity={vicinity}
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
                  dispatch(hospitalCordinates(sort))
                  
                });
                //DISPATCH user current location
                dispatch(userCurrentLoc(data.description));
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


            <Text>Miles: {miles}</Text>
            <Text>Est Time: {time}</Text>


          </View>
          <View style={styles.results}>


            <Text>{desc || 'Loading.....'}</Text>


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
