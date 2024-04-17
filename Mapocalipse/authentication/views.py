from django.shortcuts import render, redirect
from django.contrib.auth import login as auth_login
from .models import User
from .utils import hash_password


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
        email = request.POST['email']
        # Add validation for the data here
        if User.objects.filter(username=username).exists():
            return render(request, 'register.html', {'error': 'Username already exists'})
        else:
            try:
                user = User.objects.create_user(username=username, email=email, first_name=firstname, last_name=lastname, password=password)
            except ValueError as ve:
                return render(request, 'register.html', {'error': str(ve)})
            auth_login(request, user)
            return redirect('game:homepage')
    else:
        return render(request, 'register.html')
