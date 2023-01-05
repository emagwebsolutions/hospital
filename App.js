import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import nearbPlaces, { ascendingSort } from './utils/nearbPlaces';
import { useState, useEffect,useRef } from 'react';
import * as Location from 'expo-location';
import Map from './components/Map';

export default function App() {
  //Set latitude and longitude
  const [getCord, setCord] = useState({
    desc: '',
    lat: 5.5607445,
    lng: -0.1872202,
    vicinity: '',
  });

  //Set origin
  const [orig, setOrig] = useState();
  const [getDist, setDist] = useState();
  const [getMin, setMin] = useState();


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
      }

      Location.setGoogleApiKey('AIzaSyBwWao0VHpKLzniFCR9QKVvT0tKrkezZHI');

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
            setCord(sort);
          });
        }

        let regionName = await Location.reverseGeocodeAsync({
          longitude,
          latitude,
        });

        const street = regionName[0].street;
        const city = regionName[0].country + ', ' + regionName[0].city;

        const curloc = street || city;
        setOrig(curloc);
      }
    })();
  }, []);

  //Map component

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapbox}>
        {getCord.lat && getCord.lng && (
          <Map
            latitude={getCord.lat}
            longitude={getCord.lng}
            desc={getCord.desc}
            vicinity={getCord.vicinity}
            orig={orig}
            setDist={setDist}
            setMin={setMin}
          />
        )}
      </View>

      <View style={styles.infobox}>
        <View style={styles.title}>
          <Text>MY HEALTH LOCATOR</Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <GooglePlacesAutocomplete
          
            placeholder="Choose your current location"
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
                setCord(sort);
              });
              setOrig(data.description);
            }}
            fetchDetails={true}
            returnKeyType="search"
            enablePoweredByContainer={false}
            minLength={2}
            query={{
              key: 'AIzaSyBwWao0VHpKLzniFCR9QKVvT0tKrkezZHI',
              language: 'en',
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={400}
          />
        </View>

        <View style={styles.km}>
          <Text>Miles: {getDist}</Text>
          <Text>Est Time: {getMin}</Text>
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
