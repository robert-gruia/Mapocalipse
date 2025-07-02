from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib.auth import login as auth_login, logout as auth_logout
from .models import User
from .utils import hash_password, generateRandomCode
from django.http import JsonResponse


def login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Login failed. Please try again.'})
        if user.password == hash_password(password):
            auth_login(request, user)
            return JsonResponse({'redirect': reverse('game:homepage')})
        else:
            return JsonResponse({'error': 'Login failed. Please try again.'})
    else:
        return render(request, 'login.html')
        
def register(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        confirmPassword = request.POST['confirmpassword']
        email = request.POST['email']

        if password != confirmPassword:
            return JsonResponse({'error': 'Passwords do not match'})
        
        while True:
            usercode = generateRandomCode(6)
            if not User.objects.filter(usercode=usercode).exists():
                break
        try:
            user = User.objects.create_user(username=username, email=email, password=password, usercode=usercode)
        except ValueError as ve:
            return JsonResponse({'error': str(ve)})
        auth_login(request, user)
        return JsonResponse({'redirect': reverse('game:homepage')})

    else:
        return render(request, 'login.html')
    
def logout(request):
    auth_logout(request)
    return redirect(reverse('authentication:login'))

