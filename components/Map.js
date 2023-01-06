import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useRef, useEffect } from 'react';
import apiKey from '../config';
import { useSelector } from 'react-redux';


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

export default Map;
