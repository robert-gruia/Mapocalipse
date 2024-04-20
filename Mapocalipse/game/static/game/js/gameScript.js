let map;
let panoMap;

const boundingBoxes = [
  { lat: [-60, 70], lng: [-180, -130] }, // Americas
  { lat: [-60, 70], lng: [-130, -50] }, // Americas
  { lat: [-60, 70], lng: [-50, 20] }, // Africa and Europe
  { lat: [-60, 70], lng: [20, 40] }, // Africa and Asia
  { lat: [-50, 30], lng: [40, 100] }, // Asia
  { lat: [-50, 30], lng: [100, 180] }, // Asia and Oceania
].map(box => ({
  ...box,
  latSize: box.lat[1] - box.lat[0],
  lngSize: box.lng[1] - box.lng[0],
  size: (box.lat[1] - box.lat[0]) * (box.lng[1] - box.lng[0]),
}));


function getRandomArbitrary() {
  // Calculate the total size of all bounding boxes
  const totalSize = boundingBoxes.reduce((total, box) => total + box.size, 0);

  // Select a random bounding box, weighted by size
  let random = Math.random() * totalSize;
  let box;
  for (const b of boundingBoxes) {
    if (random < b.size) {
      box = b;
      break;
    }
    random -= b.size;
  }

  // Generate a random point within the bounding box
  const lat = Math.random() * box.latSize + box.lat[0];
  const lng = Math.random() * box.lngSize + box.lng[0];

  // Check if the location is a photosphere
  /*const response = await fetch(`https://maps.googleapis.com/maps/api/streetview/metadata?location=${lat},${lng}&key=YOUR_KEY`);
  const data = await response.json();
  const isPhotosphere = data.pano_id.startsWith('CAoS') || data.pano_id.startsWith('F:-');*/

  /*if (isPhotosphere) {
    // If the location is a photosphere, try again
    return getRandomArbitrary();
  } else {
    // If the location is not a photosphere, return it
    return { lat, lng };
  }*/
  return{ lat, lng };
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
    const randomLocation = getRandomArbitrary();
    svService.getPanorama({ location: randomLocation, radius: 60000 }, (data, status) => {
      if (status === 'OK') {
        console.log(data.location.latLng.toString());
        const panorama = new google.maps.StreetViewPanorama(document.getElementById("pano"), {
          position: data.location.latLng,
          pov: {
            heading: 34,
            pitch: 10,
          },
        });
        panoMap.setStreetView(panorama);
        console.log(panoMap);
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


