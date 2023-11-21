# Create your views here.
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from .models import Comment
import json
from comment_cjc.dataSearch import search_value
from comment_cjc.dataSearch import treeData
from mylogin.auth import process_request
file_url = 0

# Create your views here.
def get_Intro (request):
    if process_request(request)==0:
        return redirect('http://127.0.0.1:8000')
    if request.method == 'GET':
        return render(request, 'introduction.html')


def introUpload(request):
    global file_url
    title = []
    if file_url == 0 :
        return JsonResponse({'status': 0,'message': '表单提交失败!'})
    if request.method == 'POST':
        data=json.loads(request.body)
        tag_key = (data.get('tag'))['tree']
        result = None
        for tree in treeData:
            result = search_value(tree, tag_key)
            if result:
                 break
        Comment.objects.filter(image=file_url).update(
        book = data.get('book'),
        publisher = data.get('publisher'),
        author = data.get('author'),
        instruction = data.get('instruction'),
        tag = result['title'],
    )
        file_url = 0
        return JsonResponse({'status': 1,'message': '表单提交成功!'})


def fileUpload(request):
    process_request(request)
    global file_url
    if request.method == 'POST' and request.FILES.get('avatar'):
        uploaded_file = request.FILES['avatar']
        file_url= uploaded_file.name
        # 指定保存文件的路径
        path1 = settings.MEDIA_ROOT + '/statics'
        path2 = settings.MEDIA_ROOT + '/static/'
        # 使用文件系统存储对象进行文件保存
        fs = FileSystemStorage(location=path1)
        fs.save(uploaded_file.name, uploaded_file)
        fs = FileSystemStorage(location=path2)
        fs.save(uploaded_file.name, uploaded_file)
        # 构建成功响应数据
        response_data = {
            'status': 'success',
            'message': '文件上传成功',
            'file_url': uploaded_file.name,
        }
        Comment.objects.create(
            image = uploaded_file.name
        )
        return JsonResponse(response_data)
        
    # 处理上传失败的情况
    response_data = {
        'status': 'error',
        'message': '文件上传失败'
    }
    return JsonResponse(response_data, status=400)





