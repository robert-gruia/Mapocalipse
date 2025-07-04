# Generated by Django 5.2.3 on 2025-07-02 10:09

import datetime
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='MultiPlayerLobby',
            fields=[
                ('lobby_id', models.CharField(max_length=6, primary_key=True, serialize=False)),
                ('gamemode', models.CharField(choices=[('world', 'World'), ('timelimit', 'Timelimit')], default='world', max_length=20)),
                ('coordinatesindex', models.IntegerField(default=0)),
                ('time_duration', models.DurationField(default=datetime.timedelta(0))),
                ('rounds', models.IntegerField(default=5)),
            ],
            options={
                'db_table': 'multiplayer_lobbies',
            },
        ),
        migrations.CreateModel(
            name='LobbyUser',
            fields=[
                ('lobby_user_id', models.AutoField(primary_key=True, serialize=False)),
                ('round_finished', models.BooleanField(default=False)),
                ('points', models.IntegerField(default=0)),
                ('round_distance', models.FloatField(default=0)),
                ('role', models.CharField(choices=[('host', 'Host'), ('player', 'Player')], default='player', max_length=6)),
                ('user', models.ForeignKey(max_length=50, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
                ('lobby', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='multiplayer.multiplayerlobby')),
            ],
            options={
                'db_table': 'lobby_users',
            },
        ),
        migrations.CreateModel(
            name='Coordinates',
            fields=[
                ('coordinate_id', models.AutoField(primary_key=True, serialize=False)),
                ('lat', models.FloatField()),
                ('lng', models.FloatField()),
                ('lobby', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='multiplayer.multiplayerlobby')),
            ],
            options={
                'db_table': 'multiplayer_coordinates',
            },
        ),
    ]
