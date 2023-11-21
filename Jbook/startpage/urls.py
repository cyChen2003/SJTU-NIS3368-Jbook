from django.urls import path
from .views import *
from startpage.views import startpage
from rest_framework.routers import DefaultRouter
from startpage import views

urlpatterns = [
  path('startpage/', startpage, name='startpage'),
  path('api/books/', views.get_all_books, name='get_all_books'),
  path('api/set_favor/', views.api_set_favor, name='api_set_favor'),
]

