from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from .utils import hash_password
from django.core.exceptions import ObjectDoesNotExist

class CustomUserManager(BaseUserManager): 
    #creates a user
    def create_user(self, username, email, password, usercode):
        
        fields = {
            'Email': email,
            'Password': password,
            'Username': username,
            'Usercode': usercode
        }

        missing_fields = [field for field, value in fields.items() if not value]

        if missing_fields:
            raise ValueError(f'The following fields must be set: {", ".join(missing_fields)}')
        
        
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, password=hash_password(password), usercode=usercode)
        user.save(using=self._db)
        return user

    #creates a superuser
    def create_superuser(self, username, email, password=None):
        user = self.create_user(username, email, password)
        user.is_superuser = True
        user.save(using=self._db)
        return user
    
    

class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=100)
    usercode = models.CharField(max_length=6, unique=True)
    password = models.CharField(max_length=32)
    email = models.EmailField(max_length=100, unique=True)
    is_superuser = models.BooleanField(default=False)
    is_anonymous = False

    #customized user manager
    objects = CustomUserManager()

    REQUIRED_FIELDS = ['username']
    USERNAME_FIELD = 'email'

    #defines what table is used by the model
    class Meta:
        db_table = 'users' 