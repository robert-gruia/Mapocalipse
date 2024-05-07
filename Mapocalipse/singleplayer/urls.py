from django.urls import path
from . import views


urlpatterns = [
    path('home/', views.home, name='home'),
    path('world/', views.world, name='world'),
    path('multiplayer/', views.multiplayer, name='multiplayer'),
    path('createLobby/', views.createLobby, name='createLobby'),
    path('getCoordinates/', views.getCoordinates, name='getCoordinates'),   
]