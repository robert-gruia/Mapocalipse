import datetime
from django.core.files.base import ContentFile
from django.db import models
from django.conf import settings

class GameMode(models.TextChoices):
    WORLD = 'world',
    TIMELIMIT = 'timelimit',
    ITALY = 'italy',


class SinglePlayerLobby(models.Model):
    lobby_id = models.CharField(primary_key=True, max_length=6)
    gamemode = models.CharField(
        max_length=20,
        choices=GameMode.choices,
        default=GameMode.WORLD
    )
    coordinatesindex = models.IntegerField(default=0)
    time_duration = models.DurationField(default=datetime.timedelta(minutes=5))
    points = models.IntegerField(default=0)
    gamemode = models.CharField(default=GameMode.WORLD, max_length=20)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    @classmethod
    def createLobby(cls, lobby_id, user):
        lobby = cls(user_id=user, lobby_id=lobby_id)
        lobby.save()
        return lobby

    class Meta:
        db_table = 'singleplayer_lobbies'



class Coordinates(models.Model):
    coordinate_id = models.AutoField(primary_key=True)
    lat = models.FloatField()
    lng = models.FloatField()
    lobby = models.ForeignKey(SinglePlayerLobby, on_delete=models.CASCADE)

    @classmethod
    def createCoordinate(cls, lat, lng, lobby):
        coordinate = cls(lat=lat, lng=lng, lobby=lobby)
        coordinate.save()
        return coordinate

    class Meta:
        db_table = 'coordinates'