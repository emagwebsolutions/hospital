import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import nearbPlaces, { ascendingSort } from './utils/nearbPlaces';
import MapView, { Marker } from 'react-native-maps';
import { useState, useRef, useEffect } from 'react';
import MapViewDirections from 'react-native-maps-directions';
// import Geolocation from '@react-native-community/geolocation';

export default function App() {
  //Set latitude and longitude
  const [getCord, setCord] = useState({
    desc: 'Trust Specialist Hospital, Osu',
    lat: 5.5607445,
    lng: -0.1872202,
    vicinity: '1 Sunkwa Road, Accra',
  });

  //Set origin
  const [orig, setOrig] = useState();
  const [getDist, setDist] = useState();
  const [getMin, setMin] = useState();

  // const [position, setPosition] = useState({
  //   latitude: 10,
  //   longitude: 10,
  //   latitudeDelta: 0.001,
  //   longitudeDelta: 0.001,
  // });

  // useEffect(() => {
  //   Geolocation.getCurrentPosition((pos) => {
  //     const crd = pos.coords;
  //     setPosition({
  //       latitude: crd.latitude,
  //       longitude: crd.longitude,
  //       latitudeDelta: 0.0421,
  //       longitudeDelta: 0.0421,
  //     });
  //   }).catch((err) => {
  //     console.log(err);
  //   });
  // }, []);

  // console.log(position)







  //Map component
  const Map = ({ latitude, longitude, desc, vicinity }) => {
    const mapRef = useRef(null);
    useEffect(() => {
      if ((!orig, !vicinity)) return;

      //Zoom
      mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      });
    }, [orig, vicinity]);

    useEffect(() => {
      if ((!orig, !vicinity)) return;
      const getTravelTime = async () => {
        try {
          const obj = await fetch(
            `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${orig}&destinations=${vicinity}&key=AIzaSyBwWao0VHpKLzniFCR9QKVvT0tKrkezZHI`
          );
          const data = await obj.json();
          const dist = data.rows[0].elements[0];

          if (dist) {
            setDist(dist?.distance.text);
            setMin(dist?.duration.text);
          }

          //
        } catch (err) {
          console.log(err);
        }
      };

      getTravelTime();
    }, [orig, vicinity]);



    return (
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        mapType="mutedStandard"
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        {orig && vicinity && (
          <MapViewDirections
            origin={orig}
            destination={vicinity}
            apikey="AIzaSyBwWao0VHpKLzniFCR9QKVvT0tKrkezZHI"
            strokeWidth={3}
            strokeColor="black"
          />
        )}

        <Marker
          coordinate={{
            latitude,
            longitude,
          }}
          title="Destination"
          description={desc}
          identifier="destination"
        />
      </MapView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapbox}>
        {getCord.lat && getCord.lng && (
          <Map
            latitude={getCord.lat}
            longitude={getCord.lng}
            desc={getCord.desc}
            vicinity={getCord.vicinity}
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
          <Text>{getCord.desc || 'No hospital found'}</Text>
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
