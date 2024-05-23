let randomLocation;
let line;
let nextButton, mapButton;
let marker;
let panoMap;
let isGuessable = true;
let randomLocationMarker;
let map;
let setCoordinates;
let timer;

async function endRound() {
    await deleteLobby();
    window.location.href = "../home/";
}

async function initialize() {
    let lobbyId = await getLobbyId();
    url = 'ws://' + window.location.host + '/ws/multiplayer/' + lobbyId + '/game/';

    const gameSocket = new WebSocket(url);
    gameSocket.onmessage = async (e) => {
        let data = JSON.parse(e.data);
        console.log(data);
        if (data.message === 'End Game') {
            this.close();
            await endRound();
            window.location.href = '/multiplayer/home/';
        }
        else if (data.message === 'all users finished') {
            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
            randomLocationMarker = new AdvancedMarkerElement({
                position: randomLocation,
                map: map,
            });
            map.setZoom(5);
            map.panTo(randomLocation);

            setTimeout(() => {
                map.setZoom(1.5);
            }, 2000);

            drawLine();
            console.log(await getPoints());
            console.log(await getDistance());

            let points = await getPoints();
            let distance = await getDistance();

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
            overlay.innerHTML = `<p style="margin: 0; color: white;">Points: ${points.points} Distance: ${distance.round_distance}</p>`;
            document.getElementById('map').appendChild(overlay);
            if (await getUserRole() === 'host') {
                nextButton.style.display = 'block';
                mapButton.style.display = 'none';
            }
        }
        else if (data.message === 'Next Round') {
            console.log('Next Round');
            if (marker) {
                marker.setMap(null);
            }
            if (randomLocationMarker) {
                randomLocationMarker.setMap(null);
            }
            if (overlay) {
                overlay.remove();
            }
            if (line) {
                line.setMap(null);
            }
            isGuessable = true;
            mapButton.style.display = "none";
            nextButton.style.display = "none";
            await setCoordinates();
            document.querySelector('#roundNumber').innerText = (await getCoordinatesIndex() + 1) + '/' + await getLobbyRounds();
            document.querySelector('#pointsNumber').innerText = points.points;
            await setRoundAsNotFinished();
            if (await getLobbyTime() !== 0) {
                timer = startTimer(await getLobbyTime(), document.querySelector('#timeNumber'), async () => {
                    gameSocket.send(JSON.stringify({ 'message': 'End Game' }));
                });
            }
        }
        else if (data.message === 'Game Over') {
            await endRound();
            window.location.href = '/multiplayer/home/';
        }
    }
    return gameSocket;
}

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



async function initMap() {
    const gameSocket = await initialize();
    const svService = new google.maps.StreetViewService();
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    setCoordinates = async () => {
        const coordinates = await getCoordinates();
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

    console.log(await getUserRole());
    if (await getUserRole() === 'host') {
        document.querySelector('.endButton').style.display = 'block';
        document.querySelector('.endButton').addEventListener('click', () => { gameSocket.send(JSON.stringify({ 'message': 'End Game' })) });
    }

    try {
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
            if (isGuessable) await setRoundAsFinished(randomLocation.lat, randomLocation.lng, marker.position.lat, marker.position.lng);
            isGuessable = false;
        });

        nextButton = createButton(map, "Next", async () => {
            gameSocket.send(JSON.stringify({ 'message': 'Next Round' }));
        });
        mapButton.style.display = "none";
        nextButton.style.display = "none";
        panoMap = createMap(document.getElementById("panomap"), { lat: 0, lng: 0 }, 2);
        document.querySelector('#roundNumber').innerText = (await getCoordinatesIndex() + 1) + '/' + await getLobbyRounds();
        let points = await getPoints();
        document.querySelector('#pointsNumber').innerText = points.points;
        await setCoordinates();
        console.log(await getLobbyTime());
        if (await getLobbyTime() !== 0) {

            document.getElementById('timeNav').style.display = 'block';
            timer = startTimer(await getLobbyTime(), document.querySelector('#timeNumber'), async () => {
                gameSocket.send(JSON.stringify({ 'message': 'End Game' }));
            });
        }
    }
    catch (error) {
        console.error(error);
    }

}

// Start point
document.querySelector('.endButton').style.display = 'none';
window.loadGoogleMapsApi().then(initMap).catch(console.error);