from django.urls import path
from . import views

urlpatterns = [
    path('upload/introtUpload', views.get_Intro, name='comment'),
    path('upload/fileUpload',views.fileUpload, name='upload_image')
]