from django.db import models

# Create your models here.
# class Books(models.Model):
    # name = models.CharField(max_length=64,unique=True,primary_key=True)
    # publisher = models.CharField(max_length=128, blank=True)
    # author = models.CharField(max_length=128, blank=True)
    # course = models.CharField(max_length=128, blank=True)
    # publish_date = models.DateTimeField(auto_now_add=False,max_length=128)
    # price = models.FloatField(default=0.00)
    # rating = models.FloatField(blank=True)
    # comment_count = models.IntegerField(default=0)
    # time_uploaded = models.DateTimeField(auto_now_add=False,max_length=128)
class UserFavorite(models.Model):
    user = models.CharField(max_length=64)
    book = models.CharField(max_length=64)