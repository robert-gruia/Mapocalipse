from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from .models import User
from .utils import hash_password




def login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(request, username=username, password=hash_password(password))
        if user is not None:
            login(request, user)
            return redirect('/map/')
        else:
            return render(request, 'login.html', {'error': 'Login failed. Please try again.'})
        
def register(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        email = request.POST['email']
        # Add validation for the data here
        if User.objects.filter(username=username).exists():
            return render(request, 'register.html', {'error': 'Username already exists'})
        else:
            user = User(username=username, email=email)
            user.password = hash_password(password)
            user.save()
            login(request, user)
            return redirect('/map/')
    else:
        return render(request, 'register.html', {'error': 'Registration failed. Please try again.'})
