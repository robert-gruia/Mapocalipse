let randomLocation;
let lines;
let nextButton, mapButton;
let marker;
let panoMap;
let isGuessable = true;
let randomLocationMarker;
let map;
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
    const svService = new google.maps.StreetViewService();

    const coordinates = await getCoordinates();
    console.log('Coordinates', coordinates);
    const setCoordinates = async () => {
        const panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), {
            position: coordinates,
            pov: {
                heading: 34,
                pitch: 10
            },
            disableDefaultUI: true,
            enableCloseButton: false,
            showRoadLabels: false
        });
        panoMap.setStreetView(panorama);
        panoMap.setCenter(coordinates);
        randomLocation = coordinates;
    }

    if (await getUserRole() === 'host') {
        document.querySelector('.endButton').addEventListener('click', endRound);
    }

    try {
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

        // Button
        mapButton = createButton(map, "Guess", async () => {
            randomLocationMarker = new AdvancedMarkerElement({
                position: randomLocation,
                map: map,
            });
            isGuessable = false;

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
            overlay.innerHTML = `<p style="margin: 0; color: white;">Points: ${distance_score.score} Distance: ${distance_score.distance}<br> Witing for other players</p>`;
            document.getElementById('map').appendChild(overlay);
        });
        mapButton.style.display = "none";
        panoMap = createMap(document.getElementById("panomap"), { lat: 0, lng: 0 }, 2);
        await setCoordinates();
    }
    catch (error) {
        console.error(error);
    }

}


// Start point
document.querySelector('.endButton').computedStyleMap.display = 'none';
window.loadGoogleMapsApi().then(initMap).catch(console.error);