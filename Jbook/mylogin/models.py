from django.db import models
from django.utils import timezone
# Create your models here.
class Auth_User(models.Model):
    #name为外码
    name = models.CharField(max_length=64,unique=True,primary_key=True)
    password = models.CharField(max_length=512)
    email = models.CharField(max_length=128,unique=True)

class Auth_User_captcha(models.Model):
    email = models.CharField(max_length=128,unique=True,primary_key=True)
    captcha = models.CharField(max_length=64)
    time = models.DateTimeField(auto_now_add=False,max_length=128)