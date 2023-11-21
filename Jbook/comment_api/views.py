from django.shortcuts import render
from comment_cjc.models import Comment
from Jbook.comment_api.serializers import Comment_cjc_Serializer
from rest_framework import viewsets
from django.http import HttpResponse,JsonResponse

# Create your views here.

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = Comment_cjc_Serializer
    queryset = Comment.objects.all()

def getcomment(request):
    if  request.method == "GET":
        print("test_commentapi")
        return JsonResponse({'text': 'test_comment'})
