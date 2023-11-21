from django.db import models

class Comment(models.Model):
    book = models.CharField(max_length=100,null=True)
    publisher = models.CharField(max_length=100, null=True)
    author = models.CharField(max_length=100, null=True)
    instruction = models.CharField(max_length=500, null=True)
    tag = models.CharField(max_length=50, null=True)
    image = models.CharField(max_length=100, null=True)
# Create your models here.
