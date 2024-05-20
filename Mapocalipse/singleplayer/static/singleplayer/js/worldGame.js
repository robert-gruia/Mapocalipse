let map;
let marker;
let randomLocationMarker;
let randomLocation;
let panoMap;
let line;
let overlay;
let isGuessable = true;

async function drawLine() {
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
    return await calculateDistanceBetweenCoordinates(marker.position, randomLocation);
  }
}

function removeLine() {
  if (line) {
    line.setMap(null);
  }
}

async function endRound() {
  await deleteLobby();
  window.location.href = "../home/";
}



async function initMap() {
  // Street view Service creation
  const svService = new google.maps.StreetViewService();

  // Function to set valid coordinates(in order for each round)
  const setCoordinates = async () => {
    let coordinates = await getCoordinatesFromServer();
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
    randomLocation = coordinates;
  };

  // Button to finish the round
  document.querySelector('.endButton').addEventListener('click', endRound);


  // GAME GENERATION 
  try {
    let validCoordinates;
    // Check if the lobby exists
    if (await getLobbyId() == 0) {
      await createLobby();
    }
    // Check if the game is over
    if (await getSessionCoordIndex() === 5) {
      await deleteLobby();
      window.location.href = "../home/";
    }
    // Check if for that lobby the coordinates are already generated
    if (!await checkExistingCoordinates()) {
      validCoordinates = await generateValidCoordinates(svService);
      await sendCoordinatesToServer(validCoordinates);
    }
    // Sets the round and the points values
    document.querySelector('#roundNumber').innerText = await getSessionCoordIndex() + 1;
    document.querySelector('#pointsNumber').innerText = await getPoints();
    // Advanced Marker Element creation
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    // Map creation
    map = await createMap(document.getElementById("map"), { lat: 0, lng: 0 }, 2, "4e6fe42e5a3ab531");

    // Map options
    map.setOptions({
      streetViewControl: false,
      mapTypeControl: false,
      zoomControl: false,
      scaleControl: false,
      rotateControl: false,
      fullscreenControl: true
    });

    //Map event listener
    map.addListener("click", async function (e) {

      if (marker && isGuessable) {
        marker.setMap(null);
      }
      if (isGuessable) {
        mapButton.style.display = "block";
        marker = new AdvancedMarkerElement({
          position: e.latLng,
          map: map,
        });
      }
    });

    // Buttons generation
    let nextButton, mapButton;
    mapButton = createButton(map, "Guess", async () => {
      randomLocationMarker = new AdvancedMarkerElement({
        position: randomLocation,
        map: map,
      });
      isGuessable = false;
      let distance_score = await drawLine();
      mapButton.style.display = "none";
      nextButton.style.display = "block";

      // Zoom animation
      map.setZoom(5);
      map.panTo(randomLocation);

      setTimeout(() => {
        map.setZoom(3);
      }, 2000);

      // Create a transparent element with points and distance
      overlay = document.createElement('div');
      overlay.id = 'overlay';
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '50px';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      overlay.style.display = 'flex';
      overlay.style.justifyContent = 'center';
      overlay.style.alignItems = 'center';
      overlay.innerHTML = `<p style="margin: 0; color: white;">Points: ${distance_score.score} Distance: ${distance_score.distance}</p>`;
      document.getElementById('map').appendChild(overlay);
    });

    // Next button 
    nextButton = createButton(map, "Next", async () => {
      // If sessionCoordIndex is 4, show a popup
      if (await getSessionCoordIndex() === 4) {
        let popup = createPopup("#popup", async () => {
          await endRound();
        });
        popup();
      }
      let response = await changeLocation();
      if (response === "over") {
        window.location.href = "../home/";
      }
      if (document.getElementById('overlay')) document.getElementById('overlay').remove();
      await setCoordinates();
      let sessionIndex = await getSessionCoordIndex();
      document.querySelector('#roundNumber').innerText = sessionIndex + 1;
      document.querySelector('#pointsNumber').innerText = await getPoints();
      randomLocationMarker.setMap(null);
      panoMap.setStreetView(null);
      removeLine();
      nextButton.style.display = "none";
      isGuessable = true;
    });
    mapButton.style.display = "none";
    nextButton.style.display = "none";
    panoMap = createMap(document.getElementById("panomap"), { lat: 0, lng: 0 }, 2);
    await setCoordinates();
  } catch (error) {
    console.error(error);
  }
}

// Start point
window.loadGoogleMapsApi().then(initMap).catch(console.error);



