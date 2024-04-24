let map;
let marker;
let randomLocationMarker;
let randomLocation;
let panoMap;
let line;
let isGuessable;

function drawLine() {
  if (marker && randomLocationMarker) {
    if (line) {
      line.setMap(null);
    }

    line = new google.maps.Polyline({
      path: [marker.position, randomLocationMarker.position],
      geodesic: false,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    line.setMap(map);
    calculateDistanceBetweenCoordinates(marker.position, randomLocation);
  }
}

function removeLine() {
  if (line) {
    line.setMap(null);
  }
}


async function initMap() {
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  map = createMap(document.getElementById("map"), { lat: 0, lng: 0 }, 2, "4e6fe42e5a3ab531");


  map.setOptions({
    streetViewControl: false,
    mapTypeControl: false,
    zoomControl: false,
    scaleControl: false,
    rotateControl: false,
    fullscreenControl: true
  });

  map.addListener("click", async function (e) {

    if (marker) {
      marker.setMap(null);
    }

    if (isGuessable){
      let mapButton = createButton(map, "Guess", () => {
        randomLocationMarker = new AdvancedMarkerElement({
          position: randomLocation,
          map: map,
        });
        drawLine();
        let nextButton = createButton(map, "Next", () => {
          isGuessable = false;
          tryRandomLocation();
          randomLocationMarker.setMap(null);
          panoMap.setStreetView(null);
          removeLine();
          nextButton.remove();
        });
        mapButton.remove();
      });
    }

    marker = new AdvancedMarkerElement({
      position: e.latLng,
      map: map,
    });
  });

  panoMap = createMap(document.getElementById("panomap"), { lat: 0, lng: 0 }, 2);

  const svService = new google.maps.StreetViewService();

  const tryRandomLocation = () => {
    isGuessable = false;
    randomLocation = getRandomArbitrary();
    svService.getPanorama({ location: randomLocation, radius: 620000 }, async (data, status) => {
      if (status === 'OK') {
        if (data.links.length > 1) {
          const panorama = new google.maps.StreetViewPanorama(document.getElementById("pano"), {
            position: data.location.latLng,
            pov: {
              heading: 34,
              pitch: 10,
            },
            disableDefaultUI: true,
            enableCloseButton: false,
            showRoadLabels: false
          });
          panoMap.setStreetView(panorama);
          panoMap.setCenter(data.location.latLng);
          isGuessable = true;
        }
        else {
          console.log("No Street View data found for this location.");
          setTimeout(tryRandomLocation, 100);
        }
      } else {
        console.log("No Street View data found for this location.");
        setTimeout(tryRandomLocation, 100);
      }
    });
  };

  tryRandomLocation();
}

window.loadGoogleMapsApi().then(initMap).catch(console.error);



