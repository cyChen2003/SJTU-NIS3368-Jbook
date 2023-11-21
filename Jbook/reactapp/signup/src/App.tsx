import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Checkbox,
  Form,
  Input,
  Row,
  Col,
  Alert,
  Space,
  message,
  Breadcrumb,
  Layout,
  Menu,
  theme,
  Typography,
} from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import {
  Cascader,
  DatePicker,
  InputNumber,
  Mentions,
  Select,
  TimePicker,
  TreeSelect,
} from 'antd';
import DisabledContext from 'antd/es/config-provider/DisabledContext';
const { Title } = Typography;
const { Header, Content, Footer } = Layout;
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

type FieldType = {
  username?: string;
  password?: string;
  confirm?: string;
  remember?: string;
  email?: string;
};

const App: React.FC = () => {
  const [form] = Form.useForm(); // Add this line to create a form instance
  const [messageApi, contextHolder] = message.useMessage();
  const [loadings, setLoadings] = useState<boolean[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [data, setData] = useState();

  const send_capthca = 60000;
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const enterLoading = (index: number) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });

    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 1000);
  };
  const register_success = () => {
    messageApi.open({
      type: 'success',
      content: '注册成功',
    });
  }
  const onFinish = async (values: any) => {
    const CryptoJS = require('crypto-js');//to do:测试部分
    console.log('Success:', values);
    try {
      const csrfTokenElement = document.querySelector('[name=csrfmiddlewaretoken]') as HTMLInputElement;
      const csrfToken = csrfTokenElement ? csrfTokenElement.value : '';
      const response = await axios.post('', {
        username: values.username,
        password: CryptoJS.SHA256(values.password).toString(),
        email: values.email,
        captcha: values.captcha,
      },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-CSRFToken': csrfToken,
          },
        },
      );
      console.log(response.data);
      if (response.data.status == 1) {
        register_success();
        //等待1.5秒后跳转到登录界面
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      }
      else {
        //否则输出text内容  
        const errorText = response.data.text;
        messageApi.open({
          type: 'error',
          content: errorText,
        });
      }
    } catch (error) {
      console.log(error);
    }
    enterLoading(0);
  };


  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    register_failed(); // 调用 captcha_success 函数
  };
  const captcha_success = async () => {

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
      console.log(response.data);
    } catch (e) {
      console.log(e);
      messageApi.open({
        type: 'error',
        content: '验证码发送失败，请检查邮箱是否正确',
      });
    } finally {
      messageApi.open({
        type: 'success',
        content: '验证码发送成功，10分钟内有效',
      });
    }
    setDisabled(true);
    setCountdown(send_capthca / 1000)

  };

  const register_failed = () => {
    messageApi.open({
      type: 'error',
      content: '请检查输入信息是否正确',
    });
  };

  const warning = () => {
    messageApi.open({
      type: 'warning',
      content: 'This is a warning message',
    });
  };
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (countdown >= 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1); // 每秒减少一秒
      }, 1000);
    } else {
      setDisabled(false); // 倒计时结束后启用按钮
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [countdown]);
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
        <div style={{ padding: 96, minHeight: 480, background: colorBgContainer }}>
          <div style={{ background: colorBgContainer, padding: 24, minHeight: 2, display: 'flex', justifyContent: 'center' }}>
            <Title
              level={2}
            > 交我书 </Title>
          </div>
          <>
            {contextHolder}
            <Form
              form={form} //添加form以使用钩子函数
              name="basic"
              labelCol={{ span: 11 }}
              wrapperCol={{ span: 8 }}
              style={{ maxWidth: 1000 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              method='post'
            >
              <Form.Item<FieldType>
                label="用户名"
                name="username"
                tooltip="6-12位英文、数字或下划线, 必须以英文字母开头"
                rules={[{ required: true, pattern: /^[a-zA-Z][a-zA-Z0-9_]{5,11}$/, message: '6-12位英文、数字或下划线, 必须以英文字母开头' }]}
                hasFeedback
              >
                <Input />

              </Form.Item>

              <Form.Item<FieldType>
                label="密码"
                name="password"
                rules={[{ required: true, pattern: /^.{6,}$/, message: '密码长度不得小于6位' }]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>

              <Form.Item<FieldType>
                label="确认密码"
                name="confirm"
                dependencies={['password']}
                hasFeedback
                rules={[
                  { required: true, message: '请再次输入密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('确认密码与密码不一致'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item<FieldType>
                label="邮箱"
                name="email"
                rules={[{ required: true, pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i, message: '邮箱格式不正确' }]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="验证码"
                name="captcha"
                rules={[{ required: true, pattern: /^[0-9_]{6}$/, message: '请输入收到的6位验证码' }]}
              >
                <Row gutter={12}>
                  <Col span={12}>
                    <Input placeholder="请输入验证码" />
                  </Col>
                  <Col span={12}>
                    <Button onClick={captcha_success} disabled={disabled}>
                      {disabled ? `重新发送(${countdown})` : '获取验证码'}
                    </Button>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 11, span: 16 }}
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject(new Error('请勾选同意用户协议')),
                  },
                ]}

              >
                <Checkbox>
                  我同意jBook <a href="">《用户服务协议》</a> 和 <a href="">《隐私条款》</a>
                </Checkbox>
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 14, span: 16 }}>
                <Button type="primary" htmlType="submit" loading={loadings[0]}
                >
                  注册
                </Button>
              </Form.Item>
            </Form>
          </>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>交我书 ©2023 Created by 666</Footer>
    </Layout>
  );
}

export default App;