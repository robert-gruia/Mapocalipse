var toggle = document.querySelector('.toggle');
        var checkbox = document.querySelector('.toggle input');
        var timeLimit = document.querySelector('.time-limit');

        timeLimit.disabled = true;
        toggle.addEventListener('click', function () {
            checkbox.checked = !checkbox.checked;
            timeLimit.disabled = !checkbox.checked;
        });

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
        document.getElementById('create-lobby-button').addEventListener('click', async function (event) {
            event.preventDefault();
            var rounds = document.querySelector('.createForm input[name="rounds"]').value;
            var timelimit = document.querySelector('.createForm input[name="timelimit"]').checked;
            var time = document.querySelector('.createForm input[name="time"]').value;
            try {
                await createLobby(rounds, timelimit);
            }
            catch (err) {
                console.log(err);
            }
        });