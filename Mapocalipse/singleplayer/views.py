from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from .models import SinglePlayerLobby, Coordinates
from .utils import generateRandomCode, getLobbyRef
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
    if request.POST.get('lobby_id') is None:
        request.session['lobby_id'] = 0
        return render(request, 'singleWorld.html')
    else:
        request.session['lobby_id'] = request.POST.get('lobby_id')
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
        print("Lobby Id", lobby_id)
        request.session['lobby_id'] = lobby_id
        print('Lobby created:', lobby_id)
        return HttpResponse('OK', status=200) 
    else:
        return JsonResponse({"error": "POST request required."}, status=400)


def setCoordinates(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        data = data[:5]
        user = request.user
        lobby = SinglePlayerLobby.objects.filter(user_id=user.id, lobby_id=getLobbyRef(request)).last()
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
    if request.method == 'POST':
        coordinates = Coordinates.objects.filter(lobby_id=getLobbyRef(request))
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
            lobby = SinglePlayerLobby.objects.filter(user_id=request.user.id, lobby_id=getLobbyRef(request)).last()
            data = dataList[lobby.coordinatesindex]
        except IndexError:
                print('IndexError')
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)


def checkExistingCoordinates(request):
    if request.method == 'POST':
        coordinates = Coordinates.objects.filter(lobby_id=getLobbyRef(request))
        if coordinates:
            return JsonResponse({'exists': True})
        else:
            return JsonResponse({'exists': False})
    else:
        return JsonResponse({"error": "POST request required."}, status=400)
    
def checkExistingLobby(request):
    if request.method == 'POST':
        user = request.user
        lobby_id = request.session.get('lobby_id')
        lobby = SinglePlayerLobby.objects.filter(user_id=user.id, lobby_id=getLobbyRef(request)).last()
        if lobby:
            return JsonResponse({'exists': True})
        else:
            return JsonResponse({'exists': False})
    else:
        return JsonResponse({"error": "POST request required."}, status=400)



def calculateDistance(request):
    if request.method == 'POST':
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
        lobby = SinglePlayerLobby.objects.filter(user_id=user.id, lobby_id=getLobbyRef(request)).last()
        lobby.points += int(score)
        lobby.coordinatesindex += 1
        lobby.save()

        return JsonResponse({'distance': round(distance, 2), 'score': int(score)})
    else:
        return JsonResponse({"error": "POST request required."}, status=400)


def changeLocation(request):
    if request.method == 'POST':
        try:
            lobby = SinglePlayerLobby.objects.filter(user_id=request.user.id).last()
            if lobby.coordinatesindex >= Coordinates.objects.filter(lobby_id=getLobbyRef(request)).count():
                SinglePlayerLobby.objects.filter(lobby_id=getLobbyRef(request)).delete()
                return JsonResponse({'over': 'over'})
            return HttpResponse('OK', status=200)
        except:
            return HttpResponse('No valid loaction', status=400)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)

  
def getSessionCoordIndex(request):
    if request.method == 'POST':
        if SinglePlayerLobby.objects.filter(user_id=request.user.id, lobby_id=getLobbyRef(request)).last():
            return JsonResponse({'coordIndex': SinglePlayerLobby.objects.filter(user_id=request.user.id, lobby_id=getLobbyRef(request)).last().coordinatesindex})
        else:
            return JsonResponse({'coordIndex': 0})
    else:
        return JsonResponse({"error": "POST request required."}, status=400)

def getPoints(request):
    if request.method == 'POST':
        return JsonResponse({'points': SinglePlayerLobby.objects.filter(user_id=request.user.id, lobby_id=getLobbyRef(request)).last().points})
    else:
        return JsonResponse({"error": "POST request required."}, status=400)
def deleteLobby(request):
    if request.method == 'POST':
        SinglePlayerLobby.objects.filter(user_id=request.user.id, lobby_id=getLobbyRef(request)).delete()
        request.session['lobby_id'] = 0
        return HttpResponse('OK', status=200)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)

def getLobbyId(request):
    if request.method == 'POST':
        if request.session.get('lobby_id') is not None:
            return JsonResponse({'lobby_id': request.session.get('lobby_id')})
        else:
            return JsonResponse({'lobby_id': 0})  
    else:
        return JsonResponse({"error": "POST request required."}, status=400)


