from django.urls import path
from . import views


urlpatterns = [
    path('', views.homepage, name='homepage'),
    path('singleplayer/', views.singleplayer, name='singleplayer'),
    path('multiplayer/', views.multiplayer, name='multiplayer'),
    path('world/', views.world, name='world'),
    path('timelimit/', views.timeLimit, name='timelimit'),
    path('country/', views.country, name='country'),
    path('calculate_distance/', views.calculate_distance, name='calculate_distance'),
]