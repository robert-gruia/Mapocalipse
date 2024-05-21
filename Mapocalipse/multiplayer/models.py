import datetime
from django.db import models


class GameMode(models.TextChoices):
    WORLD = 'world',
    TIMELIMIT = 'timelimit',


class MultiPlayerLobby(models.Model):
    lobby_id = models.CharField(primary_key=True, max_length=6)
    gamemode = models.CharField(
        max_length=20,
        choices=GameMode.choices,
        default=GameMode.WORLD
    )
    coordinatesindex = models.IntegerField(default=0)
    time_duration = models.DurationField(default=datetime.timedelta(minutes=5))

    @classmethod
    def createLobby(cls, lobby_id):
        lobby = cls(lobby_id=lobby_id)
        lobby.save()
        return lobby
    
    class Meta:
        db_table = 'multiplayer_lobbies'


class Coordinates(models.Model):
    coordinate_id = models.AutoField(primary_key=True)
    lat = models.FloatField()
    lng = models.FloatField()
    lobby = models.ForeignKey(MultiPlayerLobby, on_delete=models.CASCADE)

    @classmethod
    def createCoordinate(cls, lat, lng, lobby):
        coordinate = cls(lat=lat, lng=lng, lobby=lobby)
        coordinate.save()
        return coordinate

    class Meta:
        db_table = 'multiplayer_coordinates'


class LobbyUser(models.Model):
    lobby_user_id = models.AutoField(primary_key=True)
    user = models.CharField(max_length=50)
    lobby = models.ForeignKey(MultiPlayerLobby, on_delete=models.CASCADE)
    round_finished = models.BooleanField(default=False)
    points = models.IntegerField(default=0)
    round_distance = models.FloatField(default=0)

    @classmethod
    def addUserToLobby(cls, user, lobby):
        user = cls(user=user, lobby=lobby)
        user.save()
        return user

    class Meta:
        db_table = 'lobby_users'