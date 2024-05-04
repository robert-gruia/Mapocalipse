from django.shortcuts import render, redirect
from django.contrib.auth import login as auth_login
from .models import User
from .utils import hash_password, generateRandomCode


def login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return render(request, 'login.html', {'error': 'Login failed. Please try again.'})
        if user.password == hash_password(password):
            auth_login(request, user)
            return redirect('game:homepage')
        else:
            return render(request, 'login.html', {'error': 'Login failed. Please try again.'})
    else:
        return render(request, 'login.html')
        
def register(request):
    if request.method == 'POST':
        firstname = request.POST['firstname']
        lastname = request.POST['lastname']
        username = request.POST['username']
        password = request.POST['password']
        confirmPassword = request.POST['confirmpassword']
        email = request.POST['email']

        if password != confirmPassword:
            return render(request, 'login.html', {'error': 'Passwords do not match'})
        
        while True:
            usercode = generateRandomCode(6)
            if not User.objects.filter(usercode=usercode).exists():
                break
        try:
            user = User.objects.create_user(username=username, email=email, first_name=firstname, last_name=lastname, password=password, usercode=usercode)
        except ValueError as ve:
            return render(request, 'login.html', {'error': str(ve)})
        auth_login(request, user)
        return redirect('game:homepage')
    else:
        return render(request, 'login.html')
