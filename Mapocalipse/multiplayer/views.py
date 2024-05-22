from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .models import MultiPlayerLobby, Coordinates, LobbyUser
from .utils import generateRandomCode, getLobbyRef
from geopy.distance import geodesic
import json
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# Create your views here.
def home(request):
    return render(request, 'multiplayerHome.html')

def worldLobby(request):
    return render(request, 'worldLobby.html')

def timeLimitLobby(request):
    return render(request, 'timeLimitLobby.html')

def joinLobby(request):
    return render(request, 'joinLobby.html')

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
            if data.get('rounds') is None:
                lobby = MultiPlayerLobby.createLobby(lobby_id, time_duration=data.get('timelimit'))
            elif data.get('time_duration') is None:
                lobby = MultiPlayerLobby.createLobby(lobby_id, rounds=data.get('rounds'))
            else:
                lobby = MultiPlayerLobby.createLobby(lobby_id, rounds=data.get('rounds'), time_duration=data.get('timelimit'))
            request.session['lobby_id'] = lobby_id
            LobbyUser.addUserToLobby(user=request.user, lobby=lobby)
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
        lobby = getLobbyRef(lobby_id)
        lobby.delete()
        return HttpResponse('OK', status=200)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)

def joinLobby(request):
    if request.method == 'POST':
        lobby_id = request.POST.get('lobby_id')
        request.session['lobby_id'] = lobby_id
        LobbyUser.addUserToLobby(user=request.user, lobby=getLobbyRef(request))
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
        users = LobbyUser.objects.filter(lobby=lobby_id)
        return JsonResponse({"users": users}, status=200)
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

        users = LobbyUser.objects.filter(lobby=getLobbyRef(request))
        if all(user.round_finished for user in users):
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f"lobby_{lobby_id}",
                {
                    "type": "all_users_finished",
                }
            )

        return HttpResponse('OK', status=200)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)


def getUserPoints(request):
    if request.method == 'POST':
        user = LobbyUser.objects.get(user=request.user, lobby=getLobbyRef(request))
        return JsonResponse({"points": user.points}, status=200)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)

def getUserDistance(request):
    if request.method == 'POST':
        user = LobbyUser.objects.get(user=request.user, lobby=getLobbyRef(request))
        return JsonResponse({"distance": user.round_distance}, status=200)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)
