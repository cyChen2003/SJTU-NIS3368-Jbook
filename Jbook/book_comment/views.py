from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, JsonResponse
# from .models import Book
from comment_cjc.models import Comment
from newcomment.models import Newcomment
from mylogin.auth import process_request

# Create your views here.

def get_book_info(request, book_id):
    Book = get_object_or_404(Comment, id=book_id)  # 接口
    comments = Newcomment.objects.filter(book_info=book_id)

    book_comments = []

    for comment in comments:
        book_comments.append({
            'comment': comment.comment,
            'user': comment.user,
            # rate保留一位小数
            'rate': round(comment.rate, 1),
        })

    book_info = {
        'id': Book.id,
        'book': Book.book,
        'author': Book.author,
        'publisher': Book.publisher,
        'tag': Book.tag,
        'image': Book.image,
        'instruction': Book.instruction,
        'comments': book_comments
    }

    return JsonResponse(book_info,safe=False)


def book_comment(request,book_id):
    if process_request(request)==0:
        return redirect('http://127.0.0.1:8000')
    if request.method == 'GET':
        return render(request, 'book_comment.html')

