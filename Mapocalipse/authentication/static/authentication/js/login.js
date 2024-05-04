$(document).ready(function() {
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
});