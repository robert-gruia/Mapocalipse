async function init() {
    var toggle = document.querySelector('.toggle');
    var checkbox = document.querySelector('.toggle input');
    var timeLimit = document.querySelector('.time-limit');
    let url;
    const svService = new google.maps.StreetViewService();

    async function initialize(host) {
        let lobbyId = await getLobbyId();
        url = 'ws://' + window.location.host + '/ws/multiplayer/' + lobbyId + '/startGame/';

        const startGameSocket = new WebSocket(url);
        startGameSocket.onmessage = (e) => {
            let data = JSON.parse(e.data);
            console.log(data);
            if (data.message === 'Start Game') {
                window.location.href = '/multiplayer/world/';
            }
        }

        if (host) {
            startGameSocket.addEventListener('open', function (event) {
                this.send(JSON.stringify({ message: 'Start Game' }));
            });
        }

        return startGameSocket;

    }


    timeLimit.disabled = true;
    toggle.addEventListener('click', function () {
        checkbox.checked = !checkbox.checked;
        timeLimit.disabled = !checkbox.checked;
    });

    // change screens button
    document.getElementById('create-button').addEventListener('click', function (event) {
        event.preventDefault();
        document.querySelector('.createForm').style.display = 'flex';
        document.querySelector('.joinForm').style.display = 'none';
    });
    document.getElementById('join-button').addEventListener('click', function (event) {
        event.preventDefault();
        document.querySelector('.joinForm').style.display = 'flex';
        document.querySelector('.createForm').style.display = 'none';
    });

    // create lobby button
    document.getElementById('create-lobby-button').addEventListener('click', async function (event) {
        event.preventDefault();
        var rounds = document.querySelector('.createForm input[name="rounds"]').value;
        var timelimit = document.querySelector('.createForm input[name="timelimit"]').checked;
        var time = document.querySelector('.createForm input[name="time"]').value;
        try {
            document.querySelector('.lobbyForm').style.display = 'flex';
            document.querySelector('.createForm').style.display = 'none';
            let users = await getLobbyUsers();
            let userHTML = users.map(user => `
                    <div class="user">
                        <p>${user.user__username} - ${user.role}</p>
                    </div>
                    <hr>
                `).join('');

            document.querySelector('.user-list').innerHTML = userHTML;
            await createLobby(rounds, timelimit);
            await generateValidCoordinates(svService);
            document.getElementById('start-game-button').addEventListener('click', async function (event) {
                event.preventDefault();
                const startGameSocket = initialize(true);
            });
        }
        catch (err) {
            console.log(err);
        }
    });

    // join lobby button
    document.getElementById('join-lobby-button').addEventListener('click', async function (event) {
        event.preventDefault();
        var code = document.querySelector('.joinForm input[name="code"]').value.replace('#', '');
        try {
            const error = await joinLobby(code);
            document.querySelector('.lobbyForm').style.display = 'flex';
            document.querySelector('.joinForm').style.display = 'none';
            document.getElementById('start-game-button').style.display = 'none';
            let users = await getLobbyUsers();
            let userHTML = users.map(user => `
            <div class="user">
            <p>${user.user__username} - ${user.role}</p>
            </div>
            <hr>
            `).join('');
            
            document.querySelector('.user-list').innerHTML = userHTML;
            const startGameSocket = initialize(false);
        }
        catch (err) {
            console.error('Error:', err.message);
            document.querySelector('.joinForm #error').innerText = err.message;
        }
    });
}

window.loadGoogleMapsApi().then(init).catch(console.error);