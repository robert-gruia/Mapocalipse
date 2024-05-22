import random
import string
from .models import LobbyUser

def generateRandomCode(length):
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(length))

def getLobbyRef(request):
    lobby = LobbyUser.objects.filter(user=request.user)
    return lobby if lobby is not None else 0