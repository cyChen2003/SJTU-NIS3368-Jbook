from django.test import TestCase
from django.core import mail
from .views import send_sms_code
from datetime import datetime
import time
from django.test import TestCase, Client
from django.urls import reverse
from .models import Auth_User, Auth_User_captcha
import time
from django.utils import timezone

class EmailTest(TestCase):
    def test_send_email(self):  
        # 发送电子邮件
        send_sms_code({'email':'2273202874@sjtu.edu.cn'})
        self.assertEqual(mail.outbox[0].from_email, '2273202874@qq.com')
        self.assertEqual(mail.outbox[0].to, ['2273202874@sjtu.edu.cn'])
        

class EmailLoginTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = Auth_User.objects.create(name='test', email='2273202874@sjtu.edu.cn', password='test')
        self.captcha = Auth_User_captcha.objects.create(email='2273202874@sjtu.edu.cn', captcha='123456', time=datetime.fromtimestamp(time.time()))
        
    def test_mylogin_success(self):
        # 测试登录成功的情况
        data = {'email': '2273202874@sjtu.edu.cn', 'captcha': '123456','loginType':'email'}
        response = self.client.post(reverse('mylogin'), data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.client.session['username'], 'test')

    def test_mylogin_email_not_exist(self):
        # 测试邮箱不存在的情况
        data = {'email': 'not_exist@example.com', 'captcha': '123456','loginType':'email'}
        response = self.client.post(reverse('mylogin'), data,content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'status': -1, 'text': '邮箱不存在！请先注册！'})
        self.assertNotIn('username', self.client.session)

    def test_mylogin_captcha_not_exist(self):
        # 测试验证码不存在的情况
        Auth_User_captcha.objects.filter(email='2273202874@sjtu.edu.cn').delete()
        data = {'email': 'test@example.com', 'captcha': '123456','loginType':'email'}
        response = self.client.post(reverse('mylogin'), data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'status': -1, 'text': '请先获取验证码！'})
        self.assertNotIn('username', self.client.session)

    def test_mylogin_captcha_error(self):
        # 测试验证码错误的情况
        data = {'email': '2273202874@sjtu.edu.cn', 'captcha': '654321','loginType':'email'}
        response = self.client.post(reverse('mylogin'), data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'status': -1, 'text': '验证码错误'})
        self.assertNotIn('username', self.client.session)

    def test_mylogin_captcha_not_exist(self):
        # 测试验证码不存在的情况
        Auth_User_captcha.objects.filter(email='2273202874@sjtu.edu.cn').delete()
        data = {'email': '2273202874@sjtu.edu.cn', 'captcha': '123456','loginType':'email'}
        response = self.client.post(reverse('mylogin'), data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'status': -1, 'text': '请先获取验证码！'})
        self.assertNotIn('username', self.client.session)

        
class RegisterTest(TestCase):
    def setUp(self):
        self.client = Client()

    def test_get_register_page(self):
        response = self.client.get(reverse('myregister'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'register.html')

    def test_post_existing_user(self):
        # 创建一个现有用户
        existing_user = Auth_User.objects.create(name='existing_user', password='password123', email='existing@example.com')
        existing_captcha = Auth_User_captcha.objects.create(email='existing@example.com', captcha='123456',time = datetime.fromtimestamp(time.time()),)
        data = {
            'username': 'existing_user',
            'password': 'password123',
            'email': 'existing@example.com',
            'captcha': '123456'
        }
        response = self.client.post(reverse('myregister'), data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'status': 0, 'text': '用户名或邮箱已注册！'})


    def test_post_successful_registration(self):
        # 假设验证码有效
        captcha = Auth_User_captcha.objects.create(email='new@example.com', captcha='123456', time=datetime.fromtimestamp(time.time()))

        data = {
            'username': 'new_user',
            'password': 'new_password',
            'email': 'new@example.com',
            'captcha': '123456'
        }

        response = self.client.post(reverse('myregister'), data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'status': 1, 'text': '注册成功！'})
        
