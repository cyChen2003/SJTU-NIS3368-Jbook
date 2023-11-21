from django.db import models

# Create your models here.
# class Book(models.Model):
#     name = models.CharField(max_length=64,unique=True,primary_key=True)
#     author = models.CharField(max_length=64)
#     publisher = models.CharField(max_length=64)
#     price = models.FloatField(default=0)

# class Comment(models.Model):
#     # book以Book表的name字段为外键
#     book = models.ForeignKey(Book, on_delete=models.CASCADE, default="CSAPP")
#     content = models.CharField(max_length=1000)
#     user = models.CharField(max_length=64)
#     date = models.DateTimeField(auto_now_add=True)