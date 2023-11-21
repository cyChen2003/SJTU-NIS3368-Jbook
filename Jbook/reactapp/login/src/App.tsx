import {
  WechatOutlined,
  LockOutlined,
  MobileOutlined,
  MailOutlined,
  QqOutlined,
  UserOutlined,
  GithubOutlined,
  QuestionCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  LoginForm,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { message, Space, Tabs, Button, FloatButton, Layout, theme, Typography, Form } from 'antd';
import type { CSSProperties } from 'react';
import { useState, useEffect } from 'react';
import { on } from 'events';
import { log } from 'console';

type LoginType = 'email' | 'account';
const { Header, Content, Footer } = Layout;
const iconStyles: CSSProperties = {
  marginInlineStart: '16px',
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '24px',
  verticalAlign: 'middle',
  cursor: 'pointer',
};

const App: React.FC = () => {
  const [captchaHashkey, setCaptchaHashkey] = useState('');
  const [captchaImageUrl, setCaptchaImageUrl] = useState('');
  const [form] = Form.useForm(); // Add this line to create a form instance
  const [cookies, setCookie] = useCookies(['csrftoken']);
  const csrfToken = cookies.csrftoken || Cookies.get('csrftoken');
  const onSubmit = async (values: any) => {
    const CryptoJS = require('crypto-js');//to do:测试部分
    if (loginType == 'email') {
      const response = await axios.post('', {
        email: values.email,
        captcha: values.captcha,
        loginType: loginType,
      },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-CSRFToken': csrfToken, // 添加 CSRF 令牌，无效
          },
        },
      );
      if (response.data.status == -1) {
        const errorText = response.data.text;
        message.error(errorText);
        handleRefreshCaptcha();
      }
      else {
        message.success('登录成功！');
        setTimeout(() => {
          window.location.href = "/startpage";
        }, 2000);
      }
    }
    else if (loginType == 'account') {
      const response = await axios.post('', {
        username: values.username,
        password: CryptoJS.SHA256(values.password).toString(),
        captcha: values.captcha,
        captcha_hash: captchaHashkey,
        loginType: loginType,
      },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-CSRFToken': csrfToken, // 添加 CSRF 令牌，无效
          },
        },
      );
      if (response.data.status == -1) {
        const errorText = response.data.text;
        message.error(errorText);
        handleRefreshCaptcha();
      }
      else {
        message.success('登录成功！');
        setTimeout(() => {
          window.location.href = "/startpage";
        }, 2000);
      }
    }
  };
  useEffect(() => {
    // 动态刷新验证码
    const refreshCaptcha = async () => {
      const response = await fetch('refresh_captcha/');
      const result = await response.json();
      setCaptchaImageUrl(result.image_url);
      setCaptchaHashkey(result.hashkey);
    };
    refreshCaptcha();
  }, []);

  const handleRefreshCaptcha = async () => {
    // 刷新验证码
    const response = await fetch('refresh_captcha/');
    const result = await response.json();
    setCaptchaImageUrl(result.image_url);
    setCaptchaHashkey(result.hashkey);
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [loginType, setLoginType] = useState<LoginType>('email');

  return (
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div style={{ padding: 36, minHeight: 480, background: colorBgContainer }}>

          <ProConfigProvider hashed={false}>
            <div style={{ backgroundColor: 'white' }}>
              <LoginForm

                onFinish={onSubmit}
                form={form} //添加form以使用钩子函数
                logo="https://vi.sjtu.edu.cn/img/base/LogoVar.png"
                title="交我书"

                subTitle="一个帮助你读书的地方"
                actions={
                  <Space>
                    其他登录方式
                    <WechatOutlined style={iconStyles} />
                    <QqOutlined style={iconStyles} />
                    <GithubOutlined style={iconStyles} />
                  </Space>
                }
              >
                <Tabs
                  centered
                  activeKey={loginType}
                  onChange={(activeKey) => setLoginType(activeKey as LoginType)}
                >
                  <Tabs.TabPane key={'account'} tab={'账号密码登录'} />
                  <Tabs.TabPane key={'email'} tab={'邮箱登录'} />
                </Tabs>
                {loginType === 'account' && (
                  <>
                    <ProFormText
                      name="username"
                      fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined className={'prefixIcon'} />,
                      }}
                      placeholder={'用户名'}
                      rules={[
                        {
                          required: true,
                          pattern: /^[a-zA-Z][a-zA-Z0-9_]{5,11}$/,
                          message: '6-12位英文、数字或下划线, 必须以英文字母开头',
                        },
                      ]}
                    />
                    <ProFormText.Password
                      name="password"
                      fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined className={'prefixIcon'} />,
                      }}
                      placeholder={'请输入您的密码'}
                      rules={[
                        {
                          required: true,
                          message: '请输入密码！',
                        },
                      ]}
                    />
                    <div style={{ display: 'flex', alignItems: 'center' }}>

                      <ProFormText
                        name="captcha"
                        fieldProps={{
                          size: 'large',
                          prefix: <LockOutlined className={'prefixIcon'} />,
                        }}
                        placeholder={'请输入验证码'}
                        rules={[
                          {
                            required: true,
                            message: '请输入验证码！',
                          },
                        ]}
                      />
                      <div>
                        <img className="captcha" src={captchaImageUrl} alt="captcha" onClick={handleRefreshCaptcha} style={{ marginTop: '-4px' }} />
                        <input id="id_captcha_0" type="hidden" value={captchaHashkey} />
                      </div>
                    </div>
                  </>
                )}
                {loginType === 'email' && (
                  <>
                    <ProFormText
                      fieldProps={{
                        size: 'large',
                        prefix: <MailOutlined className={'prefixIcon'} />,
                      }}
                      name="email"
                      placeholder={'请输入邮箱'}
                      rules={[
                        {
                          required: true,
                          message: '请输入邮箱！',
                        },
                        {
                          pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                          message: '邮箱格式错误！',
                        },
                      ]}
                    />

                    <ProFormCaptcha
                      fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined className={'prefixIcon'} />,
                      }}
                      captchaProps={{
                        size: 'large',
                      }}
                      placeholder={'请输入验证码'}
                      captchaTextRender={(timing, count) => {
                        if (timing) {
                          return `${count} ${'获取验证码'}`;
                        }
                        return '获取验证码';
                      }}
                      name="captcha"
                      rules={[
                        {
                          required: true,
                          message: '请输入验证码！',
                        },
                      ]}
                      onGetCaptcha={async () => {
                        const csrfTokenElement = document.querySelector('[name=csrfmiddlewaretoken]') as HTMLInputElement;
                        const csrfToken = csrfTokenElement ? csrfTokenElement.value : '';
                        try {
                          const email = await form.getFieldValue(['email']); // Use the form instance to call validateFields
                          const response = await axios.post('/test/', {
                            email: email,
                          },
                            {
                              headers: {
                                'Content-Type': 'application/json',
                                Accept: 'application/json',
                                'X-CSRFToken': csrfToken,
                              },
                            },
                          );
                        } catch (e) {
                          console.log(e);
                          message.error('验证码发送失败，请检查邮箱是否正确');
                        }
                        finally {
                          message.success('获取验证码成功！');
                        }
                      }
                      }
                    />
                  </>
                )}
                <div
                  style={{
                    marginBlockEnd: 24,
                  }}
                >
                  <ProFormCheckbox noStyle name="autoLogin">
                    自动登录
                  </ProFormCheckbox>
                  <Button
                    type="link"
                    onClick={(event: React.MouseEvent<HTMLElement>) => {
                      window.location.href = "/register";
                    }}
                    style={{
                      "left": '25px',
                    }}
                  >
                    注册账号
                  </Button>
                  <Button
                    type="link"
                    onClick={(event: React.MouseEvent<HTMLElement>) => {
                      window.location.href = "https://www.bilibili.com";
                    }}
                    style={{
                      float: 'right',
                    }}
                  >
                    忘记密码
                  </Button>
                </div>
              </LoginForm>
            </div>
          </ProConfigProvider>

        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>交我书 ©2023 Created by 666</Footer>
    </Layout>
  );

};
export default App;