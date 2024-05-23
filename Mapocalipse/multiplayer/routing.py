from django.urls import re_path
from . import consumers


websocket_urlpatterns = [
    re_path(r'ws/multiplayer/(?P<lobby_id>\w+)/startGame/$', consumers.StartGameConsumer.as_asgi()),
    re_path(r'ws/multiplayer/(?P<lobby_id>\w+)/game/$', consumers.GameConsumer.as_asgi()),
]