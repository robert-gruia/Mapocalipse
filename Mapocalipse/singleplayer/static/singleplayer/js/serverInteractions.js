// THIS FILE CONTAINS ALL THE FUNCTIONS THAT INTERACT WITH THE SERVER


// Checks if lobby coordinates already exist
const checkExistingCoordinates = async () => {
  const response = await fetch('../checkExistingCoordinates/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log(data);
  return data.exists;
}


// Generation of valid coordinates
const generateValidCoordinates = async (svService) => {
  console.log('generating coordinates');
  console.log(svService);
  let validCoordinates = [];
  while (validCoordinates.length < 5) {
    const promises = Array.from({ length: 20 }, () => new Promise((resolve) => {
      svService.getPanorama({ location: getRandomArbitrary(), radius: 1000000 }, (data, status) => {
        if (status === 'OK' && data.links.length > 2) {
          validCoordinates.push(data.location.latLng);
        }
        resolve();
      });
    }));
    await Promise.allSettled(promises);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return validCoordinates.slice(0, 5);
};

// Send coordinates to server
const sendCoordinatesToServer = async (validCoordinates) => {
  const response = await fetch('../setCoordinates/', {
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

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return await response.json();
  } else {
    return await response.text();
  }
};


// Creates the lobby
const createLobby = async () => {
  const response = await fetch('../createLobby/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return await response.json();
  } else {
    return await response.text();
  }
};

// Checks if the lobby exists
const checkExistsingLobby = async (lobby_id) => {
  const response = await fetch('../checkExistingLobby/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
    body: JSON.stringify({'lobby_id': lobby_id}),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.exists;
};


// Gets the coordinates from the server
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
  return await response.json();
};


// Change coordinates list index of the lobby
const changeLocation = async () => {
  const response = await fetch('../changeLocation/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    let resp = await response.json();
    return resp.over;
  } else {
    return await response.text();
  }
};


// Distance and point for that distance calculation
async function calculateDistanceBetweenCoordinates(position1, position2) {
  const lat1 = position1.lat;
  const lng1 = position1.lng;
  const lat2 = position2.lat;
  const lng2 = position2.lng;

  const response = await fetch('../calculateDistance/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify({ lat1, lng1, lat2, lng2 })
  });

  const data = await response.json();

  return data;
}

// Gets the current index of the coordinates list
async function getSessionCoordIndex() {
  const response = await fetch('../getSessionCoordIndex/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    }
  });

  const data = await response.json();
  console.log(data);
  return data.coordIndex;
}

// Gets the points of the lobby
async function getPoints() {
  const response = await fetch('../getPoints/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    }
  });

  const data = await response.json();
  console.log(data);
  return data.points;
}

// Deletes the lobby
async function deleteLobby() {
  const response = await fetch('../deleteLobby/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

    return await response.text();
}


async function getLobbyId() {
  const response = await fetch('../getLobbyId/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    }
  });

  const data = await response.json();
  console.log(data);
  return data.lobby_id;
}


async function getGamemode() {
  const response = await fetch('../getGamemode/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    }
  });

  const data = await response.json();
  return data.gamemode;
}

async function changeLobbyType(gamemode) {
  const response = await fetch('../changeLobbyType/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify({'gamemode': gamemode })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

}