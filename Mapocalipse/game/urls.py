from django.urls import path
from . import views


urlpatterns = [
    path('', views.homepage, name='homepage'),
    path('singleplayer/', views.singleplayer, name='singleplayer'),
    path('multiplayer/', views.multiplayer, name='multiplayer'),
]