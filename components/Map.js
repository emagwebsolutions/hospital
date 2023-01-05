import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useRef, useEffect } from 'react';

const Map = ({
  latitude,
  longitude,
  desc,
  vicinity,
  orig,
  setDist,
  setMin,
}) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if ((!orig, !vicinity)) return;

    //Zoom
    mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    });
  }, [orig, vicinity, latitude,longitude ]);

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
  }, [orig, vicinity, latitude, longitude]);

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

export default Map;
