from django.contrib import admin
from comment_cjc.models import Comment

# Register your models here.
class CommentAdmin(admin.ModelAdmin):
    list = ('book', 'publisher', 'author', 'instruction', 'tag', 'image')
    admin.site.register(Comment)


# class Comment(models.Model):
#     book = models.CharField(max_length=100,null=True)
#     publisher = models.CharField(max_length=100, null=True)
#     author = models.CharField(max_length=100, null=True)
#     instruction = models.CharField(max_length=500, null=True)
#     tag = models.CharField(max_length=50, null=True)
#     image = models.CharField(max_length=100, null=True)
