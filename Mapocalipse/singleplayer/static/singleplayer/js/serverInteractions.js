//checks if there are already existent coordinates
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

//valid coordinates generation

const generateValidCoordinates = async (svService) => {
  console.log('generating coordinates');
  console.log(svService);
  let validCoordinates = [];
  while (validCoordinates.length < 5) {
    const promises = Array.from({ length: 20 }, () => new Promise((resolve) => {
      svService.getPanorama({ location: getRandomArbitrary(), radius: 100000 }, (data, status) => {
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

//send coordinates to server
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

const checkExistsingLobby = async () => {
  const response = await fetch('../checkExistingLobby/', {
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
  return data.exists;
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

  return await response.json();
};


//change coordinate list index
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


//distance calculation
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

  console.log('Distance:', data.distance);
  return data;
}

//get the index of the current coordinate in the coordinates list
//useful for seeing in which round the player is 
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