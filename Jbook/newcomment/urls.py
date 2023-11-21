from django.urls import path
from . import views

urlpatterns = [
    path('book_comment/<int:book_id>/commentUpload', views.uploadComment, name='book_coment'),
    path('book_comment/<int:book_id>/getbookInfo', views.getBookinfo, name='bookinfo'),
]