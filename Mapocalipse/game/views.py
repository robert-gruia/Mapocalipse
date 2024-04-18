from django.shortcuts import render

def homepage(request):
    return render(request, 'homepage.html')


def multiplayer(request):
    return render(request, 'multiplayer.html')


def singleplayer(request):
    return render(request, 'singleplayer.html')     
