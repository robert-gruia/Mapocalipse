from django.urls import path
from . import views


urlpatterns = [
    path('home/', views.home, name='home'),
    path('world/', views.world, name='world'),
    path('multiplayer/', views.multiplayer, name='multiplayer'),
    #lobby paths
    path('createLobby/', views.createLobby, name='createLobby'),
    path('deleteLobby/', views.deleteLobby, name='deleteLobby'),
    path('checkExistingLobby/', views.checkExistingLobby, name='checkExistingLobby'),
    path('getLobbyId/', views.getLobbyId, name='getLobbyId'),
    #coordinates paths
    path('getCoordinates/', views.getCoordinates, name='getCoordinates'),
    path('checkExistingCoordinates/', views.checkExistingCoordinates, name='checkExistingCoordinates'),
    path('setCoordinates/', views.setCoordinates, name='setCoordinates'),
    path('getSessionCoordIndex/', views.getSessionCoordIndex, name='getSessionCoordIndex'),
    #game related paths
    path('changeLocation/', views.changeLocation, name='changeLocation'),
    path('calculateDistance/', views.calculateDistance, name='calculateDistance'),
    path('getPoints/', views.getPoints, name='getPoints'),
]