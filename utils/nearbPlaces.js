import apiKey from '../config'

const nearbPlaces = (obj,callback) => {

  const latitude = obj.latitude;
  const longitude = obj.longitude;
  const radius = 1000;
  const placeType = 'hospital';
  const googleAPIKey = apiKey.key

  const url =
    'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' +
    latitude +
    ',' +
    longitude +
    '&radius=' +
    radius +
    '&type=' +
    placeType +
    '&key=' +
    googleAPIKey;

  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      let place = {};

      for (let gp of res.results) {
        place[gp.place_id] = {
          placeTypes: gp.types,
          cordinates: {
            lat: gp.geometry.location.lat, 
            lng: gp.geometry.location.lng,
            desc: gp.name,
            vicinity: gp.vicinity
          },
          ploaceId: gp.place_id,
          placeName: gp.name,
        };
      }

      callback(place)
    })
    .catch((error) => {
      console.log(error);
    });
};


export const ascendingSort = ( arr )=>{
  return arr.sort((a,b)=>{
      if(a.lat > b.lat) return 1;
      if(b.lat > a.lat) return -1;
      return 0
  })
}

export default nearbPlaces;
