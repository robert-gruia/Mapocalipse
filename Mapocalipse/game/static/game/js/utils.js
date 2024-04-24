async function calculateDistanceBetweenCoordinates(position1, position2) {
    const lat1 = position1.lat;
    const lng1 = position1.lng;
    const lat2 = position2.lat;
    const lng2 = position2.lng;

    const response = await fetch('../calculate_distance/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Django requires a CSRF token for POST requests
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ lat1, lng1, lat2, lng2 })
    });

    const data = await response.json();

    console.log('Distance:', data.distance);
}

// Function to get a cookie by name
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


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

let cumulativeSizes = [];
let totalSize = 0;

for (const box of boundingBoxes) {
    totalSize += box.size;
    cumulativeSizes.push(totalSize);
}

function getRandomArbitrary() {
    // Select a random bounding box, weighted by size
    let random = Math.random() * totalSize;
    let index = binarySearch(cumulativeSizes, random);
    let box = boundingBoxes[index];

    // Generate a random point within the bounding box
    const lat = Math.random() * box.latSize + box.lat[0];
    const lng = Math.random() * box.lngSize + box.lng[0];
    return { lat, lng };
}

function binarySearch(array, value) {
    let start = 0;
    let end = array.length - 1;

    while (start <= end) {
        let middle = Math.floor((start + end) / 2);

        if (array[middle] === value) {
            return middle;
        } else if (array[middle] < value) {
            start = middle + 1;
        } else {
            end = middle - 1;
        }
    }

    return start;
}


function createButton(map, text, callback) {
    const controlDiv = document.createElement('div');

    const controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '44px';
    controlUI.style.marginRight = '-150px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Guess';
    controlDiv.appendChild(controlUI);

    const controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '24px';
    controlText.style.lineHeight = '48px'; 
    controlText.style.paddingLeft = '10px';
    controlText.style.paddingRight = '10px'; 
    controlText.innerHTML = text;
    controlUI.appendChild(controlText);

    controlUI.addEventListener('click', callback);

    map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(controlDiv);
    return controlUI;
}