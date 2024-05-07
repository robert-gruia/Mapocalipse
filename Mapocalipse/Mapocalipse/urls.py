"""
URL configuration for Mapocalipse project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import RedirectView

urlpatterns = [
    #admin page path -> do not access, only admin purposes
    path('admin/', admin.site.urls),
    #default path -> redirects to login page
    path('', RedirectView.as_view(url='/authentication/login/')),
    #authentication handler app path and its urls
    path('authentication/', include(('authentication.urls', 'authentication'), namespace='authentication')),
    path('game/', include(('game.urls', 'game'), namespace='game')),
    path('singleplayer/', include(('singleplayer.urls', 'singleplayer'), namespace='singleplayer')),
    path('multiplayer/', include(('multiplayer.urls', 'multiplayer'), namespace='multiplayer'))
]
