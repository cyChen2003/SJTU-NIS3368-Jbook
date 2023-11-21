from django.urls import path
from .views import get_book_info
from .views import get_comment

urlpatterns = [
    # 其他URL映射...
    path('book_info/', get_book_info, name='book_info'),
]
