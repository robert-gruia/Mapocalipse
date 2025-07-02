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
  return data.exists;
}


// --- Weighted world grid for random location selection ---
const worldGrid = [
  // Example: 10x5 grid, weights are illustrative. You can refine these for better land/ocean balance.
  {latMin: -90, latMax: -54, lngMin: -180, lngMax: -108, weight: 0.05}, // South Pacific
  {latMin: -90, latMax: -54, lngMin: -108, lngMax: -36, weight: 0.05},
  {latMin: -90, latMax: -54, lngMin: -36, lngMax: 36, weight: 0.05},
  {latMin: -90, latMax: -54, lngMin: 36, lngMax: 108, weight: 0.05},
  {latMin: -90, latMax: -54, lngMin: 108, lngMax: 180, weight: 0.05},
  {latMin: -54, latMax: -18, lngMin: -180, lngMax: -108, weight: 0.1},
  {latMin: -54, latMax: -18, lngMin: -108, lngMax: -36, weight: 0.1},
  {latMin: -54, latMax: -18, lngMin: -36, lngMax: 36, weight: 0.2}, // South America, Africa
  {latMin: -54, latMax: -18, lngMin: 36, lngMax: 108, weight: 0.1},
  {latMin: -54, latMax: -18, lngMin: 108, lngMax: 180, weight: 0.05},
  {latMin: -18, latMax: 18, lngMin: -180, lngMax: -108, weight: 0.1},
  {latMin: -18, latMax: 18, lngMin: -108, lngMax: -36, weight: 0.2}, // Central America
  {latMin: -18, latMax: 18, lngMin: -36, lngMax: 36, weight: 0.5}, // Africa, Europe, Asia
  {latMin: -18, latMax: 18, lngMin: 36, lngMax: 108, weight: 0.3}, // India, SE Asia
  {latMin: -18, latMax: 18, lngMin: 108, lngMax: 180, weight: 0.1},
  {latMin: 18, latMax: 54, lngMin: -180, lngMax: -108, weight: 0.1},
  {latMin: 18, latMax: 54, lngMin: -108, lngMax: -36, weight: 0.2}, // North America
  {latMin: 18, latMax: 54, lngMin: -36, lngMax: 36, weight: 0.4}, // Europe, Asia
  {latMin: 18, latMax: 54, lngMin: 36, lngMax: 108, weight: 0.3}, // Asia
  {latMin: 18, latMax: 54, lngMin: 108, lngMax: 180, weight: 0.1},
  {latMin: 54, latMax: 90, lngMin: -180, lngMax: -108, weight: 0.05},
  {latMin: 54, latMax: 90, lngMin: -108, lngMax: -36, weight: 0.1},
  {latMin: 54, latMax: 90, lngMin: -36, lngMax: 36, weight: 0.1},
  {latMin: 54, latMax: 90, lngMin: 36, lngMax: 108, weight: 0.1},
  {latMin: 54, latMax: 90, lngMin: 108, lngMax: 180, weight: 0.05},
];

function weightedRandomCell(grid) {
  const totalWeight = grid.reduce((sum, cell) => sum + cell.weight, 0);
  let r = Math.random() * totalWeight;
  for (const cell of grid) {
    if (r < cell.weight) return cell;
    r -= cell.weight;
  }
  return grid[grid.length - 1];
}

function randomPointInCell(cell) {
  const lat = cell.latMin + Math.random() * (cell.latMax - cell.latMin);
  const lng = cell.lngMin + Math.random() * (cell.lngMax - cell.lngMin);
  return { lat, lng };
}

// Ultra-fast, low-batch, weighted, early-abort coordinate generation (favor land, increase radius, fallback to land-only)
const generateValidCoordinates = async (svService) => {
  let validCoordinates = [];
  let attempts = 0;
  const batchSize = 10; // Keep batch size low for responsiveness
  const maxAttempts = 100; // Prevent infinite loops
  let abort = false;
  let useLandOnly = false;

  // Favor land even more: use a land-biased cell list 80% of the time, but allow all cells 20% of the time
  const landCells = worldGrid.filter(cell => cell.weight >= 0.2);

  while (validCoordinates.length < 5 && attempts < maxAttempts && !abort) {
    // If after 50 attempts not enough found, fallback to land-only
    if (attempts === 50) useLandOnly = true;
    const points = Array.from({ length: batchSize }, () => {
      let cell;
      if (useLandOnly || Math.random() < 0.8) {
        cell = landCells[Math.floor(Math.random() * landCells.length)];
      } else {
        cell = weightedRandomCell(worldGrid);
      }
      return randomPointInCell(cell);
    });
    await Promise.all(points.map(point => new Promise((resolve) => {
      // Increase radius to 100000 for more chance to hit a panorama
      svService.getPanorama({ location: point, radius: 100000 }, (data, status) => {
        if (status === 'OK' && data.links.length > 2) {
          if (validCoordinates.length < 5) {
            validCoordinates.push(data.location.latLng);
            if (validCoordinates.length === 5) {
              abort = true;
            }
          }
        }
        resolve();
        console.log(`Attempt ${attempts + 1}: Found ${validCoordinates.length} valid coordinates.`);
      });
    })));
    attempts++;
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

async function changeLobbyTime(time) {
  const response = await fetch('../changeLobbyTime/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify({'time': time })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

}

async function getLobbyTime() {
  const response = await fetch('../getLobbyTime/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    }
  });

  const data = await response.json();
  console.log(data);
  return data.time;
}

