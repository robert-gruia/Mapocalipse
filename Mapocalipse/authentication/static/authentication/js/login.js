function register(){
    document.querySelector('.login').style.display = 'none';
    document.querySelector('.register').style.display = 'block';
}

function login(){
    document.querySelector('.login').style.display = 'block';
    document.querySelector('.register').style.display = 'none';
}

document.getElementById('_register').addEventListener('click', (event) =>{
    event.preventDefault();
    document.querySelector('.login').style.display = 'none';
    document.querySelector('.register').style.display = 'block';
});
document.getElementById('_login').addEventListener('click', (event) =>{
    event.preventDefault();
    document.querySelector('.login').style.display = 'block';
    document.querySelector('.register').style.display = 'none';
});