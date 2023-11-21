from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponse
import json
from mylogin.auth import process_request
from comment_cjc.models import Comment
from newcomment.models import Newcomment
from .models import UserFavorite
# Create your views here.
def startpage(request):
    if process_request(request)==0:
        return redirect('http://127.0.0.1:8000')
    if request.method == 'GET':
        return render(request, 'startpage.html')

def get_all_books(request):
    # 获取所有图书的信息
    books = Comment.objects.all()
    Favorite = UserFavorite.objects.all()
    # 将图书信息转化为 JSON 格式
    books_data = []
    for book in books:
        books_data.append({
            'book': book.book,
            'author': book.author,
            'publisher': book.publisher,
            'tag': book.tag,
            'image': book.image,
            'instruction': book.instruction,
            'id':book.id,
        })
        # if Favorite.filter(user=request.session.get("username"), book=book).exists():
        #     books_data[-1]['favorite'] = True
        # else:
        #     books_data[-1]['favorite'] = False
    
    return JsonResponse(books_data, safe=False)

def api_set_favor(request):
    data = json.loads(request.body)
    book_id = data['book_id']
    user = request.session.get("username")
    favor =UserFavorite.objects.filter(user=user, book_id=book_id).first()
    if favor:
        UserFavorite.objects.delete(favor)
        return JsonResponse({'status': 1,'text':"取消收藏成功"},safe=False)
    else:
        UserFavorite.objects.create(user=user, book_id=book_id)
        return JsonResponse({'status': 1,'text':"收藏成功"},safe=False)