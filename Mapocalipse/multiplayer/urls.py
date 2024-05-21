from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.home, name='home'),
    path('worldLobby/', views.worldLobby, name='worldLobby'),
    path('timelimitLobby/', views.timeLimitLobby, name='timeLimitLobby'),
    path('joinLobby/', views.joinLobby, name='joinLobby'),
    path('createLobby/', views.createLobby, name='createLobby'),
    path('deleteLobby/', views.deleteLobby, name='deleteLobby'),
    path('leaveLobby/', views.leaveLobby, name='leaveLobby'),
    path('getLobbyUsers/', views.getLobbyUsers, name='getLobbyUsers'),
    path('setRoundAsFinished/', views.setRoundAsFinished, name='setRoundAsFinished'),
    path('getUserPoints/', views.getUserPoints, name='getUserPoints'),
    path('getUserDistance/', views.getUserDistance, name='getUserDistance'),
]