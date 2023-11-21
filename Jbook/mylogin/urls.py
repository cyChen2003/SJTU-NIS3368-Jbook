from django.urls import path
from .views import *
from mylogin.views import IndexView
from mylogin.views import test_email
urlpatterns = [
  path('', mylogin, name='mylogin'),
  path('register/', myregister, name='myregister'),
  path('captcha/', include('captcha.urls')),

  
]