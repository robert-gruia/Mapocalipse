import hashlib
import random
import string

def hash_password(password):
    return hashlib.md5(password.encode()).hexdigest()

def generateRandomCode(length):
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(length))