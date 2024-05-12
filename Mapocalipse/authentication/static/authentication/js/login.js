$(document).ready(function() {
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

    $('#_register').click(function(e) {
        e.preventDefault();
        $('.login').hide();
        $('.register').show();
    });

    $('#_login').click(function(e) {
        e.preventDefault();
        $('.register').hide();
        $('.login').show();
    });

    $("form[action='../login/']").submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/authentication/login/',
            type: 'POST',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
            },
            data: {
                username: $('#loginUsername').val(),
                password: $('#loginPassword').val()
            },
            success: function(data) {
                if (data.error) {
                    $('#loginError').text(data.error);
                }
                if (data.redirect) {
                    window.location.href = data.redirect;
                }
            }
        });
    });

    $("form[action='../register/']").submit(function(e) {
        e.preventDefault();
        console.log('Email value:', $('#registerEmail').val());
        $.ajax({
            url: '/authentication/register/',
            type: 'POST',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
            },
            data: {
                firstname: $('#firstname').val(),
                lastname: $('#lastname').val(),
                username: $('#registerUsername').val(),
                password: $('#registerPassword').val(),
                confirmpassword: $('#confirmPassword').val(),
                email: $('#registerEmail').val()
            },
            success: function(data) {
                if (data.error) {
                    $('#regError').text(data.error);
                }
                if (data.redirect) {
                    window.location.href = data.redirect;
                }
            }
        });
    });
});