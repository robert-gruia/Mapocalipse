const generateValidCoordinates = async (svService) => {
    let validCoordinates = [];
    console.log('Generating valid coordinates');
    while (validCoordinates.length < 5) {
        const promises = Array.from({ length: 20 }, () => new Promise((resolve) => {
            svService.getPanorama({ location: getRandomArbitrary(), radius: 1000000 }, (data, status) => {
                if (status === 'OK' && data.links.length > 2) {
                    console.log('woohooo')
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


const createLobby = async (rounds = '', timelimit = '') => {
    let body;
    if (rounds !== '' && timelimit !== '') {
        body = JSON.stringify({ 'rounds': rounds, 'timelimit': timelimit });
    }
    else if (rounds !== '') {
        body = JSON.stringify({ 'rounds': rounds });
    }
    else if (timelimit !== '') {
        body = JSON.stringify({ 'timelimit': timelimit });
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

const getUserPoints = async () => {
    const response = await fetch('../getUserPoints/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};

const getUserDistance = async () => {
    const response = await fetch('../getUserDistance/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
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