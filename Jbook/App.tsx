import React from 'react';
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
  tel?: number;
};

const App: React.FC = () => 
{
  const [messageApi, contextHolder] = message.useMessage();
  const register_success = () => {
    messageApi.open({
      type: 'success',
      content: '注册成功',
    });
  }
  const onFinish = (values: any) => {
    console.log('Success:', values);
    register_success(); // 调用 captcha_success 函数
  };
  
  
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const captcha_success = () => {
    messageApi.open({
      type: 'success',
      content: '验证码发送成功，10分钟内有效',
    });
  };

  const error = () => {
    messageApi.open({
      type: 'error',
      content: 'This is an error message',
    });
  };

  const warning = () => {
    messageApi.open({
      type: 'warning',
      content: 'This is a warning message',
    });
  };
  return (
  <>
  {contextHolder}
  <Form
  name="basic"
  labelCol={{ span: 15 }}
  wrapperCol={{ span: 30 }}
  style={{ maxWidth: 1000 }}
  initialValues={{ remember: true }}
  onFinish={onFinish}
  onFinishFailed={onFinishFailed}
  autoComplete="off"
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
      rules={[{ required: true, pattern: /^.{6,}$/,message: '密码长度不得小于6位' }]}
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
      label="手机号"
      name="tel"
      rules={[{ required: true, pattern: /^1[0-9_]{10}$/, message: '手机号格式不正确' }]}
      hasFeedback
    >
      <Input />
    </Form.Item>
    <Form.Item label="验证码" >
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              
              noStyle
              rules={[{ required: true, pattern:/^[0-9_]{6}$/,message: '请输入收到的6位验证码' }]}
            >
              <Input 
              placeholder="请输入验证码"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Button
            onClick={captcha_success}
                
            >获取验证码
            </Button>
          </Col>
        </Row>
      </Form.Item>
      
<Form.Item wrapperCol={{ offset: 16, span: 16 }}
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

    <Form.Item wrapperCol={{ offset: 18, span: 16 }}>
      <Button type="primary" htmlType="submit"
      >
        注册  
      </Button>
    </Form.Item>
    
  </Form>
  </>
);
}

export default App;