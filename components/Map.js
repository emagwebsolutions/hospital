import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useRef, useEffect } from 'react';
import apiKey from '../config';
import { useSelector } from 'react-redux';
import { hospitalCordinatesFunc } from '../components/appSlice';

const Map = () => {
  const hc = useSelector(hospitalCordinatesFunc);

  const mapRef = useRef(null);

  useEffect(() => {
    if ((!hc.orig, !hc.vicinity)) return;

    //Zoom
    mapRef.current.fitToSuppliedMarkers(['hc.origin', 'destination'], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    });
  }, [hc.orig, hc.vicinity, hc.lat, hc.lng]);

  return (
    <MapView
      ref={mapRef}
      style={{ flex: 1 }}
      mapType="mutedStandard"
      initialRegion={{
        latitude: hc.lat,
        longitude: hc.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
    >
      {hc.orig && hc.vicinity && apiKey.key && (
        <MapViewDirections
          origin={hc.orig}
          destination={hc.vicinity}
          apikey={apiKey.key}
          strokeWidth={3}
          strokeColor="black"
        />
      )}

      {hc.orig && hc.vicinity && apiKey.key && (
        <Marker
          coordinate={{
            latitude: hc.lat,
            longitude: hc.lng,
          }}
          title="Destination"
          description={hc.desc}
          identifier="destination"
        />
      )}
    </MapView>
  );
};

export default Map;
