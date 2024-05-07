from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from geopy.distance import geodesic
import json

def homepage(request):
    return render(request, 'homepage.html')


def singleplayer(request):
    return redirect('singleplayer:home')

def multiplayer(request):
    return redirect('multiplayer:home')


def calculate_distance(request):
    data = json.loads(request.body)
    lat1 = float(data.get('lat1'))
    lng1 = float(data.get('lng1'))
    lat2 = float(data.get('lat2'))
    lng2 = float(data.get('lng2'))

    point1 = (lat1, lng1)
    point2 = (lat2, lng2)

    distance = geodesic(point1, point2).kilometers

    return JsonResponse({'distance': distance})
