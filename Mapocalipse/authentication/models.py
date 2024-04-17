from django.db import models

class User(models.Model):
    #user fields -> same as daatbase fields
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=32)
    email = models.EmailField(max_length=100)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    
    # database table name
    class Meta:
        db_table = 'users'
