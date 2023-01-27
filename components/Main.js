import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Linking,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import nearbPlaces from '../utils/nearbPlaces';
import apiKey from '../config';
import { useSelector, useDispatch } from 'react-redux';
import {
  userCurrentLocFunc,
  userCurrentLoc,
  hospitalCordinates,
} from './appSlice';
import useAccessdevicelocation from './useAccessdevicelocation';
import MapView, { Marker } from 'react-native-maps';
import { hospitalCordinatesFunc } from './appSlice';
import { useState } from 'react';

export default function Main() {
  const hosp = useSelector(hospitalCordinatesFunc);
  const orig = useSelector((state) => state.app.orig);
  const dispatch = useDispatch();

  const listHospitals = Object.values(hosp).map((v, k) => {
    return (
      <View key={k} style={styles.hostpDetails}>
        <Text
          style={{ fontSize: 18 }}
          onPress={() => {
            Linking.openURL(
              `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${v.place_id}`
            );
          }}
        >
          {v.placeName}
        </Text>
        <Text
          onPress={() => {
            Linking.openURL(
              `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${v.place_id}`
            );
          }}
        >
          Hospital {v.cordinates?.vicinity}
        </Text>
        <Text>
          {v.user_ratings_total ? v.rating : ''}
          {v.user_ratings_total ? (
            <Image source={require('../assets/ratings.png')} />
          ) : (
            ''
          )}

          {v.user_ratings_total ? `(${v.user_ratings_total})` : ''}
        </Text>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            height: 40,
          }}
        >
          <Text style={{marginRight: 10}}>Request a ride</Text>

          <Text
            style={{
              width: 3,
              height: 42,
              flex: 1,
              justifyContent: 'center',
            }}
            onPress={() => {
              Linking.openURL(`https://m.bolt.eu/Login`);
            }}
          >
            <Image source={require('../assets/bolt.png')} /> Bolt
          </Text>

          <Text
            style={{
              width: 3,
              height: 42,
              flex: 1,
              justifyContent: 'center',
              flexDirection: 'column',
            }}
            onPress={() => {
              Linking.openURL(
                `https://auth.uber.com/v2/?breeze_local_zone=dca8&next_url=https%3A%2F%2Fm.uber.com%2Flooking%3Fmarketing_vistor_id%3D5961f56a-0132-4c10-ab87-c2aa2daf5042%26uclick_id%3Ddc9950a4-b454-445e-ac98-c006bc52571d&state=T2SBkEsZ2L4cjJA4ffIHWr-u24ZX8SCnJ6WtnoZKoL0%3D`
              );
            }}
          >
            <Image source={require('../assets/uber.png')} /> Uber
          </Text>
        </View>
      </View>
    );
  });

  const Map = () => {
    const inim = Object.values(hosp).map((v) => {
      if (v) {
        return {
          lng: v?.cordinates?.lng,
          lat: v?.cordinates?.lat,
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
            latitudeDelta: 0.033,
            longitudeDelta: 0.033,
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
                image={require('../assets/hsp.png')}
              />
            ))}
        </MapView>
      );
    } else {
      return (
        <MapView
          style={{ flex: 1 }}
          mapType="mutedStandard"
          showsUserLocation={true}
          followUserLocation={true}
          zoomEnabled={true}
          initialRegion={{
            latitude: 5.5607445,
            longitude: -0.1872202,
            latitudeDelta: 0.033,
            longitudeDelta: 0.033,
          }}
        ></MapView>
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
          <ScrollView>
            {listHospitals.length > 0 ? (
              listHospitals
            ) : (
              <Text style={{ fontSize: 22 }}>Please wait....</Text>
            )}
          </ScrollView>
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
    height: 260,
    backgroundColor: '#ccc',
    alignItems: 'center',
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
