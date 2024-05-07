from django.urls import path,  include
from . import views


urlpatterns = [
    path('', views.homepage, name='homepage'),
    path('calculate_distance/', views.calculate_distance, name='calculate_distance'),
    path('singleplayer/', views.singleplayer, name='singleplayer'),
    path('multiplayer/', views.multiplayer, name='multiplayer'),
]