from django.utils.deprecation import MiddlewareMixin
from django.shortcuts import render,redirect,HttpResponse
from django.http import HttpResponseRedirect

def process_request(request):
    # 排除不需要登录就能访问的页面
    if request.path_info in ["","/register"]: # 获取当前用户请求的 url
        return
    # 读取当前访问用户的 session 信息
    info_dict = request.session.get("username")
    print(info_dict)
    print(request.session)
    if info_dict!=None:
        return 1
        # 没有登录回到登录页面
    return 0
def process_response(request,response):
    return response