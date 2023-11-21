from django.urls import path
from .views import *
from startpage.views import startpage
from rest_framework.routers import DefaultRouter
from startpage import views

urlpatterns = [
  path('/comment_api/comment', getcomment, name='getcomment'),

]