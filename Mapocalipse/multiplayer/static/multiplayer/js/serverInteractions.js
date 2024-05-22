const createLobby = async (rounds = '', timelimit = '') => {
    let body;
    if(rounds !== '' && timelimit !== '') {
        body = JSON.stringify({'rounds': rounds, 'timelimit': timelimit});
    }
    else if(rounds !== ''){
        body = JSON.stringify({'rounds': rounds});
    }
    else if(timelimit !== ''){
        body = JSON.stringify({'timelimit': timelimit});
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
        throw new Error(`HTTP error! status: ${response.status}`);
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

    return response.json();
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