import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import nearbPlaces from '../utils/nearbPlaces';

import { useEffect, useState } from 'react';

import apiKey from '../config';
import { useSelector, useDispatch } from 'react-redux';
import {
  userCurrentLocFunc,
  userCurrentLoc,
  hospitalCordinates,
} from './appSlice';
import useGetMilesAndTime from './useGetMilesAndTime';
import useAccessdevicelocation from './useAccessdevicelocation';

import MapView, { Marker } from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';

import { hospitalCordinatesFunc } from './appSlice';

export default function Main() {
  const hosp = useSelector(hospitalCordinatesFunc);
  const orig = useSelector((state) => state.app.orig);
  const dispatch = useDispatch();

  const listHospitals = Object.values(hosp).map((v, k) => {
    return (
      <View key={k} style={styles.hostpDetails}>
        <Text style={{ fontSize: 18 }}>{v.placeName}</Text>
        <Text>Hospital {v.cordinates.vicinity}</Text>
        <Text>
          {v.user_ratings_total ? v.rating : ''}
          {v.user_ratings_total ? <Image source={require('../assets/ratings.png')} /> : ''}

          {v.user_ratings_total ? `(${v.user_ratings_total})` : ''}
        </Text>
        
        <Text>Open {v.open}</Text>
      </View>
    );
  });

  const Map = () => {
    //const [inim,setInim] = useState()

    const inim = Object.values(hosp).map((v) => {
      if (v) {
        return {
          lng: v.cordinates.lng,
          lat: v.cordinates.lat,
        };
      }
    })[0];

    if (inim) {
      return (
        <MapView
          style={{ flex: 1 }}
          mapType="mutedStandard"
          showsUserLocation={true}
          followUserLocation={true}
          zoomEnabled={true}
          initialRegion={{
            latitude: inim.lat,
            longitude: inim.lng,
            latitudeDelta: 0.055,
            longitudeDelta: 0.055,
          }}
        >
          {orig &&
            Object.values(hosp).map((v, k) => (
              <Marker
                key={k}
                coordinate={{
                  latitude: v?.cordinates?.lat,
                  longitude: v?.cordinates?.lng,
                }}
                title="Destination"
                description={v.cordinates.desc}
                identifier="destination"
              />
            ))}
        </MapView>
      );
    }
  };

  useAccessdevicelocation();

  //useGetMilesAndTime();

  const getMyCurrentLoc = orig || 'Choose your current location';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapbox}>
        <Map />
      </View>

      <View style={styles.infobox}>
        <View style={styles.title}>
          <Text>MY HOSPITAL LOCATOR</Text>
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
                const arr = Object.values(data).map((v) => {
                  if (v) {
                    return v;
                  }
                });

                //DISPATCH hospital latitude and longitued
                dispatch(hospitalCordinates(arr));
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
          <ScrollView>{listHospitals}</ScrollView>
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
    height: '50%',
  },
  infobox: {
    height: '50%',
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
    height: 300,
    backgroundColor: '#ccc',
  },

  hostpDetails: {
    flex: 0,
    paddingTop: 5,
    paddingBottom: 20,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
  },

  results: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 33,
    alignItems: 'center',
  },
});
