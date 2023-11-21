"""Jbook URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from mylogin.views import mylogin
from mylogin.views import myregister
from django.views.generic import TemplateView
from mylogin.views import IndexView
from mylogin import views
from mylogin.views import test_email
from startpage.views import startpage
from startpage.views import api_set_favor
from book_comment import views as book_views
from comment_cjc.views import get_Intro
from comment_cjc.views import introUpload
from comment_cjc.views import fileUpload
from newcomment import views as com_views
from startpage.views import get_all_books

import print.views
urlpatterns = [
    path('admin/', admin.site.urls),
    #path('',IndexView.as_view()),   
    path('',mylogin,name='mylogin'),
    path('register/',myregister,name='myregister'),
    path('captcha/', include('captcha.urls')),
    path('refresh_captcha/', views.refresh_captcha),
    path('test/', test_email, name='test'),
    path('startpage/',startpage),
    path('intro/',get_Intro),
    path('upload/introUpload', introUpload, name='intro'),
    path('upload/fileUpload',fileUpload, name='upload_image'),
    path('book_info/<int:book_id>', book_views.get_book_info),
    #path('book_comment/', book_views.get_comment),
    path('book_comment/<int:book_id>',book_views.book_comment),
    path('book_comment/<int:book_id>/commentUpload', com_views.uploadComment, name='comment'),
    path('book_comment/<int:book_id>/getbookInfo', com_views.getBookinfo, name='bookinfo'),
    path('book_comment/<int:book_id>/info/',com_views.get_Info),
    path('api/books/', get_all_books, name='get_all_books'),

    path('print/', print.views.print),
    path('api/set_favor/', api_set_favor, name='api_set_favor'),
]
