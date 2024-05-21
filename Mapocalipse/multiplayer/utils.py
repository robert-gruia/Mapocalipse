import random
import string

def generateRandomCode(length):
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(length))

def getLobbyRef(request):
    lobby = request.session.get('lobby_id')
    return lobby if lobby is not None else 0