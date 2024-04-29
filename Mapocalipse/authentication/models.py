from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from .utils import hash_password
import random
import string
from django.core.exceptions import ObjectDoesNotExist

class CustomUserManager(BaseUserManager):
    #checks if a username exists at registration
    def _username_exists(self, username):
        try:
            existing_user = User.objects.get(username=username) 
            return True
        except ObjectDoesNotExist:
            return False
    def _usercode_exists(self, usercode):
        try:
            existing_user = User.objects.get(usercode=usercode) 
            return True
        except ObjectDoesNotExist:
            return False   
    
    #creates a user
    def create_user(self, username, email, first_name, last_name, password):
        
        fields = {
            'Email': email,
            'Password': password,
            'Username': username,
            'First Name': first_name,
            'Last Name': last_name
        }

        missing_fields = [field for field, value in fields.items() if not value]

        if missing_fields:
            raise ValueError(f'The following fields must be set: {", ".join(missing_fields)}')
        
        if self._username_exists(username):
            while True:
                userCode = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(6))
                if not self._usercode_exists(userCode):
                    break
        
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, first_name=first_name, last_name=last_name, password=hash_password(password), usercode=userCode)
        user.save(using=self._db)
        return user

    #creates a superuser
    def create_superuser(self, username, email, password=None):
        user = self.create_user(username, email, password)
        user.is_superuser = True
        user.save(using=self._db)
        return user
    
    

class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=100, unique=True)
    usercode = models.CharField(max_length=6, unique=True)
    password = models.CharField(max_length=32)
    email = models.EmailField(max_length=100, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    is_superuser = models.BooleanField(default=False)
    is_anonymous = False

    #customized user manager
    objects = CustomUserManager()

    REQUIRED_FIELDS = ['email']
    USERNAME_FIELD = 'username'

    #defines what table is used by the model
    class Meta:
        db_table = 'users' 