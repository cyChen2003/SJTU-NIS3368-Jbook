import React, { useState, useEffect } from 'react';
import './index.css';
import axios, { AxiosResponse } from 'axios';
import { message, Image, Layout, Button, Checkbox, Form, Input, Space, Rate, Select, Card, Flex } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Content, Header, Footer } from 'antd/es/layout/layout';

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};



const desc = ['很差', '差', '一般', '好', '很好'];

const cardStyle: React.CSSProperties = {
  width: 700,
};

const imgStyle: React.CSSProperties = {
  display: 'block',
  width: 273,
  height: 330
};

interface bookinfo {
  book: string;
  publisher: string;
  author: string;
  image: string;
}

const App: React.FC = () => {
  const defaultBookInfo = {
    book: '',
    author: '',
    publisher: '',
    image: '',
  };
  const image = ''
  var rateValue = 0;
  const [value, setValue] = useState(Number);
  const [loadings, setLoadings] = useState<boolean[]>([]);
  const [bookinfo, setBookinfo] = useState(defaultBookInfo);
  const [messageApi, contextHolder] = message.useMessage();
  const [imageSrc, setImageSrc] = useState(image);

  // const bookData = {
  //   title: '深入理解计算机系统（原书第3版）',
  //   author: 'Randal E.Bryant / David O\'Hallaron',
  //   publisher: '机械工业出版社',
  //   // imageSrc: require('./image.png'),
  //   imageSrc: require('E:/大学学习/大三上/安全开发及安全编程/python+Django/mysite/antd-demo/src/media/深入理解计算机系统.jpg'),
  // };

  var pathname = window.location.pathname;
  var bookId = pathname.split('/')[2];

  useEffect(() => {
    // 发送 GET 请求到后端获取书籍信息
    axios.get<bookinfo>('/book_comment/' + bookId + '/getbookInfo')
      .then((response: AxiosResponse<bookinfo>) => {
        setBookinfo(response.data); // 设置书籍信息
      })
      .catch((error) => {
        console.error('Error fetching book data', error);
      });
  }, []);

  import(`./uploadImage/${bookinfo.image}`).then((image) => {
    setImageSrc(image.default);
  });



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

  const onFinish = async (values: any) => {
    console.log('Success:', values);
    const response = await axios.post('/book_comment/' + bookId + '/commentUpload', {
      book: bookinfo.book,
      author: bookinfo.author,
      publisher: bookinfo.publisher,
      comment: values.comment,
      rate: { rateValue },
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
        content: '你成功提交了评论!',
      });
      setTimeout(() => {
        window.location.href = '/book_comment/' + bookId;
      }, 1000);
    }
    enterLoading(0);
  };


  return (
    <Layout>
      {contextHolder}
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
      <Content className="site-layout" >
        <div style = {{marginLeft:'395px', marginTop: '30px'}}>
          <Card hoverable style={cardStyle} bodyStyle={{ padding: 0, overflow: 'hidden', textAlign:"left" }}>
           <Flex >
           <Image
              style={imgStyle}
              src={`/static/${bookinfo.image}`}
              fallback="data:image/png;base64,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"
            />
            <Flex vertical align="flex-end" style={{ padding: 32 }} >
            <h2>{bookinfo.book} <br />出版社: {bookinfo.publisher} <br />作者: {bookinfo.author} </h2>
           </Flex>
          </Flex>
          </Card>
        </div>
          
        <Form
          name="书评"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 1000, marginLeft: '60px', marginTop:'20px' }}
          // initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          method='POST'
        >

          <Form.Item
            label="星级"
          >
            <span>
              <Rate tooltips={desc} onChange={(value) => {
                // setValue(value);
                if (value !== null && value !== undefined) {
                  // setValue(value);
                  console.log(value);
                  rateValue = value;
                }
              }}
              />
              {rateValue ? <span className="ant-rate-text">{desc[rateValue - 1]}</span> : ''}
            </span>
          </Form.Item>

          <Form.Item
            label="评价"
            name="comment"
            rules={[{ required: true, message: '请输入你的评论!' }]}
          >
            <TextArea showCount rows={8} style={{ width: '700px' }} maxLength={500} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={loadings[0]} >
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