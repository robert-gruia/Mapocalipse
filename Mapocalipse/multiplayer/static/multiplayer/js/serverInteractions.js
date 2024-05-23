const generateValidCoordinates = async (svService) => {
    let validCoordinates = [];
    while (validCoordinates.length < await getLobbyRounds()) {
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
    await addCoordinates(validCoordinates.slice(0, 5));
};


const createLobby = async (rounds = '', timelimit = '', time = 0) => {
    let body;
    console.log(time);
    if (rounds !== '' && time !== 0) {
        body = JSON.stringify({ 'rounds': rounds, 'timelimit': timelimit, 'time': time});
    }
    else if (rounds !== '') {
        body = JSON.stringify({ 'rounds': rounds });
    }
    else if (timelimit !== 0) {
        body = JSON.stringify({ 'timelimit': timelimit, 'time': time});
    }

    const response = await fetch('../createLobby/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: body,
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

};

const deleteLobby = async () => {
    const response = await fetch('../deleteLobby/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

};

const joinLobby = async (lobbyId) => {
    const response = await fetch('../joinLobby/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({ lobby_id: lobbyId }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
    }

};

const leaveLobby = async () => {
    const response = await fetch('../leaveLobby/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

};

const getLobbyUsers = async () => {
    const response = await fetch('../getLobbyUsers/', {
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
    return data;
};

const setRoundAsFinished = async (lat1, lng1, lat2, lng2) => {
    const response = await fetch('../setRoundAsFinished/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({ lat1, lng1, lat2, lng2 }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

};


const getLobbyId = async () => {
    const response = await fetch('../getLobbyId/', {
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
    return data.lobby_id;
}

const addCoordinates = async (validCoordinates) => {
    const response = await fetch('../addCoordinates/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify(validCoordinates),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

}

const getCoordinates = async () => {
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

    const data = await response.json();
    console.log(data);
    return await data.coords;
};

const getCoordinatesIndex = async () => {
    const response = await fetch('../getCoordinatesIndex/', {
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
    return data.index;
};

const getPoints = async () => {
    const response = await fetch('../getPoints/', {
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
    return data.points;
};

const getDistance = async () => {
    const response = await fetch('../getDistance/', {
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
    return data.distance;
};

const getUserRole = async () => {
    const response = await fetch('../getUserRole/', {
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

    return data.role;
};


const getLobbyRounds = async () => {
    const response = await fetch('../getLobbyRounds/', {
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

    return data.rounds;
};

const setRoundAsNotFinished = async () => {
    const response = await fetch('../setRoundAsNotFinished/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
}

const getLobbyTime = async () => {
    const response = await fetch('../getLobbyTime/', {
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
    return data.time;
}