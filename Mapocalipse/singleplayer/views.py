from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from .models import SinglePlayerLobby, Coordinates
from .utils import generateRandomCode, getLobbyId
from geopy.distance import geodesic

import json

# Create your views here.

def home(request):
    return render(request, 'home.html')


def world(request):
    return render(request, 'singleWorld.html')

def multiplayer(request):
    return redirect('multiplayer:home')

def createLobby(request):
    if request.method == 'POST':
        user = request.user
        print(user)
        while True:
            lobby_id = generateRandomCode(6)
            if not SinglePlayerLobby.objects.filter(lobby_id=lobby_id).exists():
                break
        lobby = SinglePlayerLobby.createLobby(lobby_id, user.id)
        print('Lobby created:', lobby_id)
        return HttpResponse('OK', status=200) 
    else:
        return JsonResponse({"error": "POST request required."}, status=400)


def setCoordinates(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        data = data[:5]
        user = request.user
        lobby = SinglePlayerLobby.objects.filter(user_id=user.id).last()
        for item in data:
            lat = item['lat']
            lng = item['lng']
            print('Coordinate added:', lat, lng)
            Coordinates.createCoordinate(lat, lng, lobby)
        request.session['coordListIndex'] = 0 
        return HttpResponse('OK', status=200)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)


def getCoordinates(request):
    coordinates = Coordinates.objects.filter(lobby_id=getLobbyId(request))
    for coordinate in coordinates:
        print('Coordinate:', coordinate.lat, coordinate.lng)
    dataList = []
    for coordinate in coordinates:
        dataList.append({
            'lat': coordinate.lat,
            'lng': coordinate.lng
        })
    data = 0
    try:
        data = dataList[request.session.get('coordListIndex', 0)]
    except IndexError:
            print('IndexError')
    return JsonResponse(data, safe=False)


def checkExistingCoordinates(request):
    user = request.user
    lobby = SinglePlayerLobby.objects.filter(user_id=user.id).last()
    lobby_id = lobby.lobby_id
    coordinates = Coordinates.objects.filter(lobby_id=lobby_id)
    if coordinates:
        return JsonResponse({'exists': True})
    else:
        return JsonResponse({'exists': False})
    
def checkExistingLobby(request):
    user = request.user
    lobby = SinglePlayerLobby.objects.filter(user_id=user.id).last()
    if lobby:
        return JsonResponse({'exists': True})
    else:
        return JsonResponse({'exists': False})



def calculateDistance(request):
    data = json.loads(request.body)
    lat1 = float(data.get('lat1'))
    lng1 = float(data.get('lng1'))
    lat2 = float(data.get('lat2'))
    lng2 = float(data.get('lng2'))

    point1 = (lat1, lng1)
    point2 = (lat2, lng2)

    distance = geodesic(point1, point2).kilometers

    return JsonResponse({'distance': distance})


def changeLocation(request):
    if request.method == 'POST':
        try:
            request.session['coordListIndex'] += 1
            if request.session['coordListIndex'] >= Coordinates.objects.filter(lobby_id=getLobbyId(request)).count():
                SinglePlayerLobby.objects.filter(lobby_id=getLobbyId(request)).delete()
                return JsonResponse({'over': 'over'})
            return HttpResponse('OK', status=200)
        except:
            return HttpResponse('No valid loaction', status=400)
