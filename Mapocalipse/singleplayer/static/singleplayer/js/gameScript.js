let map;
let marker;
let randomLocationMarker;
let randomLocation;
let panoMap;
let line;

function drawLine() {
  if (marker && randomLocationMarker) {
    if (line) {
      line.setMap(null);
    }

    line = new google.maps.Polyline({
      path: [marker.position, randomLocation],
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


    mapButton.style.display = "block";

    marker = new AdvancedMarkerElement({
      position: e.latLng,
      map: map,
    });
  });


  let mapButton = createButton(map, "Guess", () => {
    randomLocationMarker = new AdvancedMarkerElement({
      position: randomLocation,
      map: map,
    });
    drawLine();
    mapButton.style.display = "none";
    nextButton.style.display = "block";
  });

  let nextButton = createButton(map, "Next", () => {
    isGuessable = false;
    tryRandomLocation();
    randomLocationMarker.setMap(null);
    panoMap.setStreetView(null);
    removeLine();
    nextButton.style.display = "none";
  });

  mapButton.style.display = "none";
  nextButton.style.display = "none";
  panoMap = createMap(document.getElementById("panomap"), { lat: 0, lng: 0 }, 2);

  const svService = new google.maps.StreetViewService();



  //valid coordinates generation

  let validCoordinates = [];
  let lobby_id = 0;

  const generateValidCoordinates = async () => {
    while (validCoordinates.length < 5) {
      await new Promise((resolve) => {
        svService.getPanorama({ location: getRandomArbitrary(), radius: 620000 }, (data, status) => {
          if (status === 'OK' && data.links.length > 1) {
            validCoordinates.push(data.location.latLng);
          }
          resolve();
        });
      });
    }
  };

  //send coordinates to server
  const sendCoordinatesToServer = async () => {
    console.log(validCoordinates);
    const response = await fetch('../createLobby/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify(validCoordinates),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data.lobby_id);
    lobby_id = data.lobby_id;
  };

  
  //get coordinates from server
  const getCoordinatesFromServer = async () => {
    const response = await fetch('../getCoordinates/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const coordinates = await response.json();
    const panorama = new google.maps.StreetViewPanorama(document.getElementById("pano"), {
      position: coordinates,
      pov: {
        heading: 34,
        pitch: 10,
      },
      disableDefaultUI: true,
      enableCloseButton: false,
      showRoadLabels: false
    });
    panoMap.setStreetView(panorama);
    panoMap.setCenter(coordinates);
  };

  //actual generation of the coordinates
  try {
    await generateValidCoordinates();
    await sendCoordinatesToServer();
  } catch (error) {
    console.error(error);
  }
}

window.loadGoogleMapsApi().then(initMap).catch(console.error);



