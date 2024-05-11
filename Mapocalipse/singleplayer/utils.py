import random
import string
from .models import SinglePlayerLobby

def generateRandomCode(length):
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(length))

def getLobbyId(request):
    user = request.user
    lobby = SinglePlayerLobby.objects.filter(user_id=user.id).last()
    return lobby.lobby_id if lobby is not None else None