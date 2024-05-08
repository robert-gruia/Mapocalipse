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
  const svService = new google.maps.StreetViewService();


  const setCoordinates = async () => {
    let coordinates = await getCoordinatesFromServer();
    const panorama = new google.maps.StreetViewPanorama(document.getElementById("pano"), {
      position: coordinates,
      pov: {
        heading: 34,
        pitch: 10,
      },
      //disableDefaultUI: true,
      enableCloseButton: false,
      showRoadLabels: false
    });
    console.log(coordinates);
    panoMap.setStreetView(panorama);
    panoMap.setCenter(coordinates);
    randomLocation = coordinates;
  };


  //actual generation of the coordinates
  try {
    let validCoordinates;
    if(! await checkExistsingLobby()){
      await createLobby();
    }
    if (!await checkExistingCoordinates()) {
      console.log('yep');
      validCoordinates = await generateValidCoordinates(svService);
      await sendCoordinatesToServer(validCoordinates);
    }
    

    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  map = await createMap(document.getElementById("map"), { lat: 0, lng: 0 }, 2, "4e6fe42e5a3ab531");


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

  let nextButton = createButton(map, "Next", async () => {
    isGuessable = false;
    let response = await changeLocation();
    if (response === "over") {
      window.location.href = "../home/";
    }  
    await setCoordinates();
    randomLocationMarker.setMap(null);
    panoMap.setStreetView(null);
    removeLine();
    nextButton.style.display = "none";
  });

  mapButton.style.display = "none";
  nextButton.style.display = "none";
  panoMap = createMap(document.getElementById("panomap"), { lat: 0, lng: 0 }, 2);

  await setCoordinates();
  } catch (error) {
    console.error(error);
  }

  
}

window.loadGoogleMapsApi().then(initMap).catch(console.error);



