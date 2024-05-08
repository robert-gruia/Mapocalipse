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


function getRandomArbitrary() {
    // Divide the area into a grid of 10x10 boxes
    const gridLatSize = 130 / 10; // latitude range from -60 to 70
    const gridLngSize = 360 / 10; // longitude range from -180 to 180
  
    // Select a random box in the grid
    const boxLat = Math.floor(Math.random() * 10) * gridLatSize - 60;
    const boxLng = Math.floor(Math.random() * 10) * gridLngSize - 180;
  
    // Generate a random point within the box
    const lat = Math.random() * gridLatSize + boxLat;
    const lng = Math.random() * gridLngSize + boxLng;
    return { lat, lng };
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