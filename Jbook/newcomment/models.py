from django.db import models

class Newcomment(models.Model):
    book_info = models.BigIntegerField(null=True)
    book = models.CharField(max_length=100, null=True)
    publisher = models.CharField(max_length=100, null=True)
    author = models.CharField(max_length=100, null=True)
    user = models.CharField(max_length=100, null=True)
    comment = models.CharField(max_length=1024, null=True)
    rate = models.FloatField(max_length=5, null=True)





# Create your models here.
