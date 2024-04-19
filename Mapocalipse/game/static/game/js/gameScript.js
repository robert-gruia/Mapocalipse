let map;
let panoMap;

function getRandomArbitrary(min, max) {
  let lat, lng;

  // Try to generate coordinates until they fall within major landmasses
  do {
    lat = Math.random() * (max - min) + min;
    lng = Math.random() * (180 - (-180)) - 180;
  } while (
    // Exclude most of the Pacific Ocean
    (lng < -130 && lng > -180 && lat > -50 && lat < 50) ||
    // Exclude most of the Atlantic Ocean
    (lng > -50 && lng < 20 && lat > -60 && lat < 60) ||
    // Exclude the Indian Ocean
    (lng > 40 && lng < 100 && lat > -50 && lat < 30) ||
    // Exclude the Arctic Ocean
    (lat > 70) ||
    // Exclude the Southern Ocean
    (lat < -60)
  );

  return { lat, lng };
}

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 0, lng: 0 },
    zoom: 2,
  });
  
  panoMap = new google.maps.Map(document.getElementById("panomap"), {
    center: { lat: 0, lng: 0 },
    zoom: 2,
  });

  const svService = new google.maps.StreetViewService();

  const tryRandomLocation = () => {
    const randomLocation = { lat: getRandomArbitrary(-90, 90), lng: getRandomArbitrary(-180, 180) };

    svService.getPanorama({ location: randomLocation, radius: 5000 }, (data, status) => {
      if (status === 'OK') {
        const panorama = new google.maps.StreetViewPanorama(document.getElementById("pano"), {
          position: data.location.latLng,
          pov: {
            heading: 34,
            pitch: 10,
          },
        });
        panoMap.setStreetView(panorama);
        panoMap.setCenter(data.location.latLng);
      } else {
        console.log('No panorama found');
        setTimeout(tryRandomLocation, 500);
      }
    });
  };

  tryRandomLocation();
}

window.loadGoogleMapsApi().then(initMap).catch(console.error);


