from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from .models import Newcomment
import json
from newcomment.models import Newcomment
from comment_cjc.models import Comment
from mylogin.auth import process_request

# Create your views here.
def get_Info (request, book_id):
    print(book_id)
    if process_request(request)==0:
        return redirect('http://127.0.0.1:8000')
    if request.method == 'GET':
        return render(request, 'comment.html')

def uploadComment (request,book_id):
    if request.method == 'POST':
        data=json.loads(request.body)
        Newcomment.objects.create(
        book_info = book_id,
        book = data.get('bookname'),
        publisher = data.get('publisher'),
        author = data.get('author'),
        comment = data.get('comment'),
        rate = (data.get('rate'))['rateValue'],
        user = request.session.get('username'),
    )
    return JsonResponse({'status': 1,'message': 'Form submitted successfully!'})

def getBookinfo(request, book_id):
    # if request.method == 'POST':
    #     global book
    #     data=json.loads(request.body)
    #     book = data.get('book')
    Book = Comment.objects.filter(id=book_id).first()  # 接口
    book_info = {
        'book': Book.book,
        'author': Book.author,
        'publisher': Book.publisher,
        'image': Book.image,
    }
    return JsonResponse(book_info)






