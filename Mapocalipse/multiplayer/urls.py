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
    path('getUserPoints/', views.getUserPoints, name='getUserPoints'),
    path('getUserDistance/', views.getUserDistance, name='getUserDistance'),
    path('getLobbyId/', views.getLobbyId, name='getLobbyId'),
    path('addCoordinates/', views.addCoordinates, name='addCoordinates'),
]