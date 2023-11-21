import React, { useState, useEffect } from 'react';
import './index.css';
import { Breadcrumb, Layout, Menu, theme, Image, Flex, Card, Rate, Button } from 'antd';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { ProList } from '@ant-design/pro-components';
import axios, { AxiosResponse } from 'axios';
import { Link, useParams } from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import src from './uploadImage/OIP-C.jpg';
{/* <Route path="/book_comment/:bookId"/> */ }

const { Header, Content, Footer } = Layout;
const choice = ['首页', '书评']

const handleMenuItemClick = (key:string) => {
  // 根据 key 执行不同的跳转操作
  if (key === '1') {
    window.location.href = '/startpage/'; // 设置跳转链接
  }
};

const IconText = ({ icon, text }: { icon: any; text: string }) => (
  <span>
    {React.createElement(icon, { style: { marginInlineEnd: 8 } })}
    {text}
  </span>
);

interface Bookinfo {
  id: number;
  book: string;
  author: string;
  publisher: string;
  tag: string;
  image: string;
  instruction: string;
  comments: [{ comment: string; user: string; rate: number }];

}

const App: React.FC = () => {
  const [value, setValue] = useState(3);
  const {
    token: { colorBgContainer },
  } = theme.useToken();


  const defaultBookInfo = {
    id: 0,
    book: '',
    author: '',
    publisher: '',
    tag: '',
    image: '',
    instruction: '',
    comments: [{ comment: '', user: '', rate: 0.0 }],
  };
  const image = './uploadImage/OIP-C.jpg'
  const [Bookinfo, setBookInfo] = useState(defaultBookInfo);
  const [imageSrc, setImageSrc] = useState(image);

  var pathname = window.location.pathname;
  var bookId = pathname.split('/')[2];
  console.log(bookId);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/book_info/' + bookId)
        setBookInfo(response.data);

      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);
  import(`./uploadImage/${Bookinfo.image}`).then((image) => {
    console.log(Bookinfo.image);
    setImageSrc(image.default);
  });

  const totalRate = Bookinfo.comments.reduce((sum, comment) => sum + comment.rate, 0);
  const averageRate = Number((totalRate / Bookinfo.comments.length).toFixed(1));
  const dataSource = Bookinfo.comments.map(comment => ({
    title: comment.user
  }));  
  

  return (
    <Layout className="layout">
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={['2']}
      onClick={({ key }) => handleMenuItemClick(key)}
    >
      {choice.map((label, index) => (
        <Menu.Item key={`${index + 1}`}>
          <a>
            {label}
          </a>
        </Menu.Item>
      ))}
    </Menu>
      </Header>
      <Content className="site-layout" style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item>书评</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ padding: 24, minHeight: 1000, background: colorBgContainer }}>
          <Flex justify="start" >

            <Image width={400} height={500} src={`/static/${Bookinfo.image}`} fallback="data:image/png;base64,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" />
            <Flex vertical align="flex-stretch" justify="start" style={{ padding: 50 }}>
              <h1 style={{ fontSize: '30px' }}>{Bookinfo.book}</h1>
              <p style={{ fontSize: '20px' }}>作者: {Bookinfo.author}</p>
              <p style={{ fontSize: '20px' }}>出版社: {Bookinfo.publisher}</p>
              <p style={{ fontSize: '20px' }}>标签: {Bookinfo.tag}</p>
              <p style={{ fontSize: '20px' }}>评分: {averageRate}</p>
              <span>
                <Rate disabled allowHalf defaultValue={averageRate} onChange={setValue} value={averageRate} />
              </span>
            </Flex>
          </Flex>
          <p style={{ fontSize: '20px' }}>简介: </p>
          <Card style={{ backgroundColor: "#FFFFCC" }}>
            <p style={{ fontSize: '20px' }}>{Bookinfo.instruction}</p>
          </Card>
          <ProList<{ title: string }>
            toolBarRender={() => {
              return [
                <Button 
                  key="3" 
                  type="primary"
                  href={`/book_comment/${Bookinfo.id}/info/`}
                  >
                  新建
                </Button>,
              ];
            }}
            itemLayout="vertical"
            rowKey="id"
            headerTitle="评论"
            dataSource={dataSource}
            metas={{
              title: {},
              description: {},
              actions: {},
              content: {
                render: (text, record) => {
                  const userComments = Bookinfo.comments.filter(
                    (comment) => comment.user === record.title
                  );
          
                  const uniqueUsernames = Array.from(new Set(userComments.map((comment) => comment.user)));

                  return (
                    <div>
                      {uniqueUsernames.map((username) => (
                        <div key={username}>
                          {userComments
                            .filter((comment) => comment.user === username)
                            .map((comment, index) => (
                              <div style={{ fontSize: '18px' }} key={index}>
                                <>
                                  <span>
                                    <Rate disabled allowHalf defaultValue={comment.rate} />
                                  </span>
                                </>
                                <p>{comment.comment}</p>
                              </div>
                            ))}
                        </div>
                      ))}
                    </div>
                  );
                }
              },
            }}
          />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
    </Layout>
  );
};

export default App;