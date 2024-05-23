from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .models import Coordinates, MultiPlayerLobby, LobbyUser
from .utils import generateRandomCode, getLobbyRef
from geopy.distance import geodesic
import json
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# Create your views here.
def home(request):
    return render(request, 'multiplayerHome.html')

def world(request):
    return render(request, 'world.html')

def calculateDistance(point1, point2):
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
        
        return {"score": int(score), "distance": distance}

def createLobby(request):
    if request.method == 'POST':
        lobby_id = generateRandomCode(6)
        if request.body:
            data = json.loads(request.body)
            print(data)
            if data.get('rounds') is None:
                lobby = MultiPlayerLobby.createLobby(lobby_id, time_duration=int(data.get('time')))
            elif data.get('time') is None:
                lobby = MultiPlayerLobby.createLobby(lobby_id, rounds=data.get('rounds'))
            else:
                lobby = MultiPlayerLobby.createLobby(lobby_id, rounds=data.get('rounds'), time_duration=int(data.get('time')))
            request.session['lobby_id'] = lobby_id
            LobbyUser.addUserToLobby(user=request.user, lobby=lobby, host=True)
            return HttpResponse('OK', status=200)
        else:
            return JsonResponse({"error": "JSON doesn't exist."}, status=400)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)

def removeAllFromLobby(request):
    users = LobbyUser.objects.filter(lobby=getLobbyRef(request))
    for user in users:
        user.delete()
    
def deleteLobby(request):
    if request.method == 'POST':
        lobby_id = request.session.get('lobby_id')
        removeAllFromLobby(request)
        lobby = getLobbyRef(request)
        lobby.delete()
        return HttpResponse('OK', status=200)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)

def joinLobby(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        lobby_id = data.get('lobby_id')
        request.session['lobby_id'] = lobby_id
        try:
            lobby = MultiPlayerLobby.objects.get(lobby_id=lobby_id)
            LobbyUser.addUserToLobby(user=request.user, lobby=lobby)
        except MultiPlayerLobby.DoesNotExist:
            return JsonResponse({"error": "Lobby doesn't exist."}, status=400)
        return HttpResponse('OK', status=200)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)
    
def leaveLobby(request):
    if request.method == 'POST':
        user = LobbyUser.objects.get(user=request.user, lobby=getLobbyRef(request))
        user.delete()
        return HttpResponse('OK', status=200)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)
    
def getLobbyUsers(request):
    if request.method == 'POST':
        lobby_id = request.session.get('lobby_id')
        lobby_users = LobbyUser.objects.filter(lobby=lobby_id).values('user__username', 'role')
        return JsonResponse(list(lobby_users), status=200, safe=False)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)
           
def setRoundAsFinished(request):
    if request.method == 'POST':
        lobby_id = request.session.get('lobby_id')
        
        data = json.loads(request.body)
        lat1 = float(data.get('lat1'))
        lng1 = float(data.get('lng1'))
        lat2 = float(data.get('lat2'))
        lng2 = float(data.get('lng2'))

        point1 = (lat1, lng1)
        point2 = (lat2, lng2)
        score_distance = calculateDistance(point1, point2)
        user = LobbyUser.objects.get(user=request.user, lobby=getLobbyRef(request))
        user.points += score_distance['score']
        user.round_distance = score_distance['distance']
        user.round_finished = True
        user.save()
        del user
        users = LobbyUser.objects.filter(lobby=getLobbyRef(request))
        response = getLobbyRounds(request)
        data = json.loads(response.content)
        rounds = data.get('rounds')
        coordIndex = getLobbyRef(request).coordinatesindex
        roundss = int(rounds) - 1
        print("Coord", coordIndex)
        print("Rounds", roundss)
        print("Calc", coordIndex == roundss)
        print("ALL", all(user.round_finished for user in users))
        if coordIndex <= roundss and all(user.round_finished for user in users):
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f"lobby_{lobby_id}",
                {
                    "type": "start_message",
                    "message": "Game Over",
                }
            )
        elif all(user.round_finished for user in users):
            lobby = getLobbyRef(request)
            lobby.coordinatesindex += 1
            lobby.save()
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f"lobby_{lobby_id}",
                {
                    "type": "start_message",
                    "message": "all users finished",
                }
            )
            

        return HttpResponse('OK', status=200)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)

    
def getLobbyId(request):
    return JsonResponse({"lobby_id": request.session.get('lobby_id')}, status=200)

def addCoordinates(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        coordinates = data
        lobby = getLobbyRef(request)

        if coordinates:
            for coord in coordinates:
                lat = coord.get('lat')
                lng = coord.get('lng')
                Coordinates.createCoordinate(lat, lng, lobby)

            return HttpResponse('OK', status=200)
        else:
            return JsonResponse({"error": "Invalid coordinates data. Expected a list of 5 coordinates."}, status=400)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)
    

def getCoordinates(request):
    if request.method == 'POST':
        lobby = getLobbyRef(request)
        coordinates = Coordinates.objects.filter(lobby=lobby).values('lat', 'lng')
        print(lobby.coordinatesindex)
        return JsonResponse({"coords" : list(coordinates)[lobby.coordinatesindex]}, status=200, safe=False)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)
    
def getCoordinatesIndex(request):
    if request.method == 'POST':
        lobby = getLobbyRef(request)
        return JsonResponse({"index": lobby.coordinatesindex}, status=200)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)
    
def getPoints(request):
    if request.method == 'POST':
        lobby = getLobbyRef(request)
        points = LobbyUser.objects.filter(lobby=lobby, user=request.user).values('points')
        return JsonResponse({'points': points[0]}, status=200, safe=False)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)

def getDistance(request):
    if request.method == 'POST':
        lobby = getLobbyRef(request)
        distance = LobbyUser.objects.filter(lobby=lobby, user=request.user).values('round_distance') 
        return JsonResponse({'distance': distance[0]}, status=200, safe=False)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)

def getUserRole(request):
    if request.method == 'POST':
        user = LobbyUser.objects.get(user=request.user, lobby=getLobbyRef(request))
        return JsonResponse({"role": user.role}, status=200)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)
    
def getLobbyRounds(request):
    if request.method == 'POST':
        lobby = getLobbyRef(request)
        return JsonResponse({"rounds": lobby.rounds}, status=200)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)

def setRoundAsNotFinished(request):
    if request.method == 'POST':
        users = LobbyUser.objects.filter(lobby=getLobbyRef(request))
        for user in users:
            user.round_finished = False
            user.save()
        return HttpResponse('OK', status=200)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)

def getLobbyTime(request):
    if request.method == 'POST':
        lobby = getLobbyRef(request)
        return JsonResponse({"time": lobby.time_duration.total_seconds()}, status=200)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)