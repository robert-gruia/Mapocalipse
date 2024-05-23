import random
import string
from .models import LobbyUser, MultiPlayerLobby

def generateRandomCode(length):
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(length))

def getLobbyRef(request):
    lobby_id = request.session.get('lobby_id')
    return MultiPlayerLobby.objects.get(lobby_id=lobby_id)