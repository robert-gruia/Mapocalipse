# Generated by Django 5.0.6 on 2024-05-10 15:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('singleplayer', '0002_singleplayerlobby_points'),
    ]

    operations = [
        migrations.AlterField(
            model_name='singleplayerlobby',
            name='gamemode',
            field=models.CharField(default='world', max_length=20),
        ),
    ]
