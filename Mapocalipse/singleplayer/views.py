from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from .models import SinglePlayerLobby, Coordinates
from .utils import generateRandomCode, getLobbyId
from geopy.distance import geodesic

import json

# Create your views here.

def home(request):
    user_id = request.user.id
    user_lobbies = SinglePlayerLobby.objects.filter(user_id=user_id)
    for lobby in user_lobbies:
        lobby.coordinatesindex += 1
    return render(request, 'home.html', {'user_lobbies': user_lobbies})


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
        lobby.coordinatesindex = 0
        lobby.save()
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
        lobby = SinglePlayerLobby.objects.filter(user_id=request.user.id).last()
        data = dataList[lobby.coordinatesindex]
    except IndexError:
            print('IndexError')
    return JsonResponse(data, safe=False)


def checkExistingCoordinates(request):
    coordinates = Coordinates.objects.filter(lobby_id=getLobbyId(request))
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

    min_distance = 100
    max_distance = 10000
    max_score = 5000

    if distance <= min_distance:
        score = max_score
    elif distance <= max_distance:
        score = ((max_distance - distance) / (max_distance - min_distance)) * max_score
    else:
        score = 0
    
    user = request.user
    lobby = SinglePlayerLobby.objects.filter(user_id=user.id).last()
    lobby.points += int(score)
    lobby.coordinatesindex += 1
    lobby.save()

    return JsonResponse({'distance': round(distance, 2)})


def changeLocation(request):
    if request.method == 'POST':
        try:
            lobby = SinglePlayerLobby.objects.filter(user_id=request.user.id).last()
            if lobby.coordinatesindex >= Coordinates.objects.filter(lobby_id=getLobbyId(request)).count():
                SinglePlayerLobby.objects.filter(lobby_id=getLobbyId(request)).delete()
                return JsonResponse({'over': 'over'})
            return HttpResponse('OK', status=200)
        except:
            return HttpResponse('No valid loaction', status=400)
        
def getSessionCoordIndex(request):
    return JsonResponse({'coordIndex': SinglePlayerLobby.objects.filter(user_id=request.user.id).last().coordinatesindex})

def getPoints(request):
    return JsonResponse({'points': SinglePlayerLobby.objects.filter(user_id=request.user.id).last().points})

def deleteLobby(request):
    SinglePlayerLobby.objects.filter(user_id=request.user.id).delete()
    return HttpResponse('OK', status=200)

