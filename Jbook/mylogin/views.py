from django.shortcuts import render
from django.views.generic import View
from captcha.models import CaptchaStore
from captcha.helpers import  captcha_image_url
from django.http import HttpResponseRedirect
from django.http import HttpResponse,JsonResponse
import datetime
import json
from django.shortcuts import redirect
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from django.template.context_processors import csrf
import hashlib
from .models import Auth_User
from .models import Auth_User_captcha
import time
#加入random库
import random
#加入mylogin.models
from mylogin.models import Auth_User
import re
def get_csrf(request):
        #生成 csrf 数据，发送给前端
    x = csrf(request)
    csrf_token = x['csrf_token']
    return HttpResponse('{} ; {}'.format(str(re), csrf_token))
def SHA256(text):
    return hashlib.sha256(text.encode('utf-8')).hexdigest()
@csrf_exempt
def myregister(request):
    if  request.method == "GET":
        return render(request, 'register.html')
    if request.method == "POST":
        data = json.loads(request.body)
        #pwd = SHA256(data['password'])
        pwd = data['password']
        #查询数据库中是否有该用户
        user = Auth_User.objects.filter(name=data['username']).first()
        email = Auth_User.objects.filter(email=data['email']).first()
        captcha = Auth_User_captcha.objects.filter(email=data['email']).first()
        timestamp = captcha.time.timestamp()    


        # 将时间戳转换为 datetime.datetime 对象
        dt_object = datetime.datetime.fromtimestamp(timestamp)

        # 将 datetime.datetime 对象格式化为字符串
        formatted_time = dt_object.strftime('%Y-%m-%d %H:%M:%S')
        print(formatted_time)
        
        if user or email:
            return JsonResponse({'status': 0, 'text': '用户名或邮箱已注册！'})
        else:   
            if captcha==None:
                return JsonResponse({'status': 0, 'text': '请先获取验证码！'})
            else:
                if data['captcha']!=captcha.captcha:
                    return JsonResponse({'status': 0, 'text': '验证码错误'}, safe=False)
                else:
                    #如果时间超过10分钟，验证码失效 
                    if  timestamp+600   <time.time():
                        return JsonResponse({'status': 0, 'text': '验证码已过期，请重新获取！'})
                    else :
                        user = Auth_User.objects.create(
                            name=data['username'],
                            password=pwd,
                            email=data['email'],
                        )
                        #删除数据库中的验证码的相关信息
                        Auth_User_captcha.objects.filter(email=data['email']).delete()
                        return JsonResponse({'status': 1,'text':"注册成功！"})
        
    

# 创建验证码
@csrf_exempt
def captcha():
    hashkey = CaptchaStore.generate_key()   #验证码答案
    image_url = captcha_image_url(hashkey)  #验证码地址
    captcha = {'hashkey': hashkey, 'image_url': image_url}
    return captcha
#刷新验证码
def refresh_captcha(request):
    return HttpResponse(json.dumps(captcha()), content_type='application/json')
# 验证验证码
def jarge_captcha(captchaStr, captchaHashkey):
    if captchaStr and captchaHashkey:
        try:
            # 获取根据hashkey获取数据库中的response值
            get_captcha = CaptchaStore.objects.get(hashkey=captchaHashkey)
            if get_captcha.response == captchaStr.lower():     # 如果验证码匹配
                return True
        except:
            return False
    else:
        return False
      

@csrf_exempt
def send_sms_code(data):
    # 生成邮箱验证码
    sms_code = '%06d' % random.randint(0, 999999)
    EMAIL_FROM = "2273202874@qq.com"  # 邮箱来自
    email_title = '欢迎使用Jbook'
    email_body = "您的邮箱验证码为：{0}, 该验证码有效时间为10分钟，请及时进行验证。".format(sms_code)
    email_to = [str(data['email'])]
    if Auth_User_captcha.objects.filter(email=email_to[0]).first():
        Auth_User_captcha.objects.filter(
            email=email_to[0]).update(captcha=sms_code)
        Auth_User_captcha.objects.filter(
            email=email_to[0]).update(time=datetime.datetime.now())
    else:
        Auth_User_captcha.objects.create(
            email=email_to[0],
            captcha=sms_code,
            time = datetime.datetime.now()
        )
    send_status = send_mail(email_title, email_body, EMAIL_FROM, email_to)
    print(send_status)
    return send_status

class IndexView(View):
    def get(self, request):
        hashkey = CaptchaStore.generate_key()  # 验证码答案
        image_url = captcha_image_url(hashkey)  # 验证码地址
        captcha = {'hashkey': hashkey, 'image_url': image_url}
        return render(request, "login.html", locals())
    def post(self,request):
        capt=request.POST.get("captcha",None)         #用户提交的验证码
        key=request.POST.get("hashkey",None)          #验证码答案
        if jarge_captcha(capt,key):
            return  JsonResponse({'status': 1,'text':"发送成功"},safe=False)
        else:
            return JsonResponse({'status': 1,'text':"发送成功"},safe=False)
        
def email_login(request,data):
    user=Auth_User.objects.filter(email=data['email']).first()
    captcha=Auth_User_captcha.objects.filter(email=data['email']).first()
    if user == None:
        return JsonResponse({'status': -1, 'text': '邮箱不存在！请先注册！'})
    else:
        if captcha==None:
            return JsonResponse({'status': -1, 'text': '请先获取验证码！'})
        else:
            if data['captcha']!=captcha.captcha:
                return JsonResponse({'status': -1, 'text': '验证码错误'}, safe=False)
            else:
                #如果时间超过10分钟，验证码失效
                if  captcha.time.timestamp()+600   <time.time():
                    return JsonResponse({'status': -1, 'text': '验证码已过期，请重新获取！'})
                else :
                    Auth_User_captcha.objects.filter(email=data['email']).delete()
                    request.session['username'] = user.name
                    return JsonResponse({'status': 1,'text':"登录成功,欢迎用户名"+user.name},safe=False)
def account_login(request,data):
    print(data)
    user=Auth_User.objects.filter(name=data['username']).first()
    if user == None:
        print("用户名不存在")
        return JsonResponse({'status': -1, 'text': '用户名不存在！请先注册！'})
    else:
        if user.password!=data['password']:
            print("密码错误")
            return JsonResponse({'status': -1, 'text': '密码错误！'})
        else:
            if jarge_captcha(data['captcha'],data['captcha_hash']):
                print("验证码正确")
                request.session['username'] = user.name # 将用户名存入session
                return redirect('/startpage/')
            else:
                print('验证码错误')
                return JsonResponse({'status': -1, 'text': '验证码错误！'})
            
def mylogin(request):
    if request.method =="GET":
        return render(request, 'login.html')
    if request.method =="POST":
        data = json.loads(request.body)
        if data['loginType']=='email':
            return email_login(request,data)
        else:
            if data['loginType']=='account':
                return account_login(request,data)
    return HttpResponse("非法请求")
@csrf_exempt
def test_email(request):
    # 调用发送邮箱验证码函数,并显示发送状态
    if request.method == "POST":
        data = json.loads(request.body)
        send_result = send_sms_code(data)
        # 输出发送状态到终端
        print('发送状态:', send_result)
        return HttpResponse("验证码已发送，请查收！")
    else :
        return HttpResponse("发送失败")