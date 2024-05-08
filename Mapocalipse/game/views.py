from django.shortcuts import render, redirect

def homepage(request):
    return render(request, 'homepage.html')


def singleplayer(request):
    return redirect('singleplayer:home')

def multiplayer(request):
    return redirect('multiplayer:home')


