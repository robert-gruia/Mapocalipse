from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from .models import SinglePlayerLobby, Coordinates
from .utils import generateRandomCode

import json

# Create your views here.

def home(request):
    return render(request, 'home.html')


def world(request):
    return render(request, 'singleWorld.html')

def multiplayer(request):
    return redirect('multiplayer:home')

def createLobby(request):
    #lobby creation
    if request.method == 'POST':
        user = request.user
        print(user)
        while True:
            lobby_id = generateRandomCode(6)
            if not SinglePlayerLobby.objects.filter(lobby_id=lobby_id).exists():
                break
        lobby = SinglePlayerLobby.createLobby(lobby_id, user.id)

        #coordinates creation
        print(request.body)
        data = json.loads(request.body)
        for item in data:
            lat = item['lat']
            lng = item['lng']
            Coordinates.createCoordinate(lat, lng, lobby)
        return JsonResponse({'lobby_id': lobby_id})
    else:
        return JsonResponse({"error": "POST request required."}, status=400)


def getCoordinates(request):
    lobby_id = request.GET.get('lobby_id')
    coordinates = Coordinates.objects.filter(lobby_id=lobby_id)
    data = []
    for coordinate in coordinates:
        data.append({
            'lat': coordinate.lat,
            'lng': coordinate.lng
        })
    return JsonResponse(data, safe=False)


