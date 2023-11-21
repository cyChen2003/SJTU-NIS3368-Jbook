import React, { useState }from 'react';
import './index.css';
import axios from 'axios';
import {treeData} from './data_category.js'
import { message, TreeSelect, Image, Tag, Layout, Upload, Button, Checkbox, Form, Input, Space, Rate, Select, } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { SelectProps } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Content, Header, Footer } from 'antd/es/layout/layout';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('你提交的文件形式只能是JPG/PNG!');
  }
  return isJpgOrPng;
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  console.log('Change:', e.target.value);
};

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

type FieldType = {
  instruction?: string;
  password?: string;
  remember?: string;
};

const { SHOW_PARENT } = TreeSelect;

const App: React.FC = () => {
  const [loadings, setLoadings] = useState<boolean[]>([]);
  const [tree, setTree] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [messageApi, contextHolder] = message.useMessage();
  
  const handleChange: UploadProps['onChange'] = async (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

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
    }, 600);
  };

  const onTreeChange = (newValue: string) => {
    console.log('onTreeChange ', tree);
    setTree(newValue);
  };

    const onFinish = async (values: any) => {
      console.log('Success:', values);
      const response = await axios.post('/upload/introUpload', {
        book: values.book,
        author: values.author,
        publisher: values.publisher,
        instruction: values.instruction,
        tag: {tree},
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );
    if (response.data.status == 1) {
      messageApi.open({
        type: 'success',
        content: '你成功提交了简介!',
      });
      setTimeout(() => {
        window.location.href = '/startpage';
      }, 1000);}
    if (response.data.status == 0) {
      messageApi.open({
        type: 'error',
        content: '你的简介提交失败，请先提交一张照片!',
      });}
    };


      const tProps = {
        treeData,
        value: tree,
        onChange: onTreeChange,
        treeCheckable: true,
        // showCheckedStrategy: SHOW_PARENT,
        placeholder: '请选择分类',
        style: {
          width: '100%',
        },
      };

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
  <Content className="site-layout" style={{ padding: '0 50px', marginLeft: '125px'}}>
  {contextHolder}
  <Form
    name="书评"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 1000, marginTop: '50px' }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
    method='POST'
  >
    <Form.Item
      label="书名"
      name="book"
      rules={[{ required: true, message: '请输入书名' }]}
    >
      <Input style ={{width: '500px'}}/>
    </Form.Item>

    <Form.Item
      label="出版社"
      name="publisher"
      rules={[{ required: true, message: '请输入出版社' }]}
    >
      <Input style ={{width: '500px'}}/>
    </Form.Item>
    <Form.Item
      label="作者"
      name="author"
      rules={[{ required: true, message: '请输入作者' }]}
    >
      <Input style ={{width: '500px'}}/>
    </Form.Item>

    <Form.Item <FieldType>
    label="图片上传" 
    valuePropName="fileList" 
    getValueFromEvent={normFile}
    rules={[{ required: true, message: '请上传一张图书的图片' }]}
    >
      <Upload
      name="avatar"
      className="avatar-uploader"
      action='/upload/fileUpload' 
      listType="picture-card"
      beforeUpload={beforeUpload}
      onChange={handleChange}
      showUploadList={false}>
      {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    </Form.Item>
    
    <Form.Item <FieldType>
    label="书籍特点">
      <TreeSelect {...tProps} style ={{width: '300px'}}/>
    </Form.Item>

    <Form.Item <FieldType>
      label="简介"
      name="instruction"
      rules={[{ required: true, message: '请输入这本书的简介' }]}
    >
    <TextArea  showCount onChange={onChange} rows={8} style ={{width: '500px'}} maxLength={300}/>
    </Form.Item>
  
    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit" loading={loadings[0]} onClick={() => enterLoading(0)}>
        提交
      </Button>
    </Form.Item>
  </Form>
  </Content>   
  <Footer style={{ textAlign: 'center' }}>交我书 ©2023 Created by 666</Footer> 
  </Layout>
  );
};



export default App;