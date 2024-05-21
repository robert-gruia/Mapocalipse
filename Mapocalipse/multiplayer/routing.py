from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/multiplayer/world/(?P<lobby_id>\w+)/$', consumers.LobbyConsumer.as_asgi()),
]