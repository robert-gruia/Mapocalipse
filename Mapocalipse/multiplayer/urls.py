from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.home, name='home'),
    path('world/', views.world, name='world'),
    path('joinLobby/', views.joinLobby, name='joinLobby'),
    path('createLobby/', views.createLobby, name='createLobby'),
    path('deleteLobby/', views.deleteLobby, name='deleteLobby'),
    path('leaveLobby/', views.leaveLobby, name='leaveLobby'),
    path('getLobbyUsers/', views.getLobbyUsers, name='getLobbyUsers'),
    path('setRoundAsFinished/', views.setRoundAsFinished, name='setRoundAsFinished'),
    path('getLobbyId/', views.getLobbyId, name='getLobbyId'),
    path('addCoordinates/', views.addCoordinates, name='addCoordinates'),
    path('getCoordinates/', views.getCoordinates, name='getCoordinates'),
    path('getCoordinatesIndex/', views.getCoordinatesIndex, name='getCoordinatesIndex'),
    path('getPoints/', views.getPoints, name='getPoints'),
    path('getUserRole/', views.getUserRole, name='getUserRole'),
    path('getLobbyRounds/', views.getLobbyRounds, name='getLobbyRounds'),
    path('getDistance/', views.getDistance, name='getDistance'),
    path('setRoundAsNotFinished/', views.setRoundAsNotFinished, name='setRoundAsNotFinished'), 
    path('getLobbyTime/', views.getLobbyTime, name='getLobbyTime'),
    path('getLobbyUsersWithPoints/', views.getLobbyUsersWithPoints, name='getLobbyUsersWithPoints'),
]