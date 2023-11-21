import React, { useState, useEffect } from 'react';
import {
  BarsOutlined,
  HomeOutlined,
  HeartOutlined,
  CarryOutOutlined,
  UserOutlined,
  TrophyOutlined,
  PlusCircleOutlined,
  StarOutlined,
  LikeOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Select, Input, Button, Pagination, List, Avatar, Space, Affix } from 'antd';
import { Footer } from 'antd/lib/layout/layout';
import axios from 'axios';

interface Book {
  book: string; // 书名
  author: string; // 作者
  publisher: string; // 出版商
  tag: string; // 标签
  image: string; // 图片 URL
  instruction: string; // 书籍介绍
  href: string; // 书籍链接
  id: number; // 书籍 id
}

const { Header, Content, Sider } = Layout;
const { Option } = Select;
const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

type MenuItem = {
  key: React.Key;
  icon?: React.ReactNode;
  children?: MenuItem[];
  label: React.ReactNode; 
  tag?: string;
};

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  tag?: string,
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    tag,
  };
}


const menuItems: MenuItem[] = [
  getItem('首页', '1', <HomeOutlined />),
  getItem('分类', '2', <BarsOutlined />, [
    getItem('01  哲学', '2-1', null, [
      getItem('哲学', '2-1-1', null, undefined, '哲学'),
      getItem('逻辑学', '2-1-2', null, undefined, '逻辑学'),
    ]),
    getItem('02  经济学', '2-2', null, [
      getItem('经济学', '2-2-1', null, undefined, '经济学'),
      getItem('经济统计学', '2-2-2', null, undefined, '经济统计学'),
      getItem('财政学', '2-2-3', null, undefined, '财政学'),
      getItem('税收学', '2-2-4', null, undefined, '税收学'),
      getItem('金融学', '2-2-5', null, undefined, '金融学'),
      getItem('保险学', '2-2-6', null, undefined, '保险学'),
      getItem('投资学', '2-2-7', null, undefined, '投资学'),
      getItem('贸易学', '2-2-8', null, undefined, '贸易学'),
    ]),
    getItem('03  法学', '2-3', null, [
      getItem('法学', '2-3-1', null, undefined, '法学'),
      getItem('政治学', '2-3-2', null, undefined, '政治学'),
      getItem('外交学', '2-3-3', null, undefined, '外交学'),
      getItem('社会学', '2-3-4', null, undefined, '社会学'),
      getItem('民族学', '2-3-5', null, undefined, '民族学'),
      getItem('马克思主义理论', '2-3-6', null, undefined, '马克思主义理论'),
      getItem('公安学', '2-3-7', null, undefined, '公安学'),
    ]),
    getItem('04  教育学', '2-4', null, [
      getItem('教育学', '2-4-1', null, undefined, '教育学'),
      getItem('体育学', '2-4-2', null, undefined, '体育学'),
      getItem('科学教育', '2-4-3', null, undefined, '科学教育'),
      getItem('人文教育', '2-4-4', null, undefined, '人文教育'),
      getItem('艺术教育', '2-4-5', null, undefined, '艺术教育'),
    ]),
    getItem('05  文学', '2-5', null, [
      getItem('汉语言文学', '2-5-1', null, undefined, '汉语言文学'),
      getItem('外国语文学', '2-5-2', null, undefined, '外国语文学'),
      getItem('新闻传播学', '2-5-3', null, undefined, '新闻传播学'),
    ]),
    getItem('06  历史学', '2-6', null, [
      getItem('历史学', '2-6-1', null, undefined, '历史学'),
      getItem('考古学', '2-6-2', null, undefined, '考古学'),
      getItem('文物与博物馆学', '2-6-3', null, undefined, '文物与博物馆学'),
    ]),
    getItem('07  理学', '2-7', null, [
      getItem('数学', '2-7-1', null, undefined, '数学'),
      getItem('物理学', '2-7-2', null, undefined, '物理学'),
      getItem('化学', '2-7-3', null, undefined, '化学'),
      getItem('天文学', '2-7-4', null, undefined, '天文学'),
      getItem('地理学', '2-7-5', null, undefined, '地理学'),
      getItem('大气科学', '2-7-6', null, undefined, '大气科学'),
      getItem('海洋科学', '2-7-7', null, undefined, '海洋科学'),
      getItem('地球物理学', '2-7-8', null, undefined, '地球物理学'),
      getItem('地质学', '2-7-9', null, undefined, '地质学'),
      getItem('生物学', '2-7-10', null, undefined, '生物学'),
      getItem('心理学', '2-7-11', null, undefined, '心理学'),
      getItem('科学技术史', '2-7-12', null, undefined, '科学技术史'),
      getItem('生态学', '2-7-13', null, undefined, '生态学'),
      getItem('统计学', '2-7-14', null, undefined, '统计学'),
    ]),
    getItem('08  工学', '2-8', null, [
      getItem('力学', '2-8-1', null, undefined, '力学'),
      getItem('机械工程', '2-8-2', null, undefined, '机械工程'),
      getItem('仪器科学', '2-8-3', null, undefined, '仪器科学'),
      getItem('材料科学', '2-8-4', null, undefined, '材料科学'),
      getItem('能源动力学', '2-8-5', null, undefined, '能源动力学'),
      getItem('电气工程', '2-8-6', null, undefined, '电气工程'),
      getItem('电子信息', '2-8-7', null, undefined, '电子信息'),
      getItem('自动化', '2-8-8', null, undefined, '自动化'),
      getItem('计算机科学', '2-8-9', null, undefined, '计算机科学'),
      getItem('土木工程', '2-8-10', null, undefined, '土木工程'),
      getItem('水利工程', '2-8-11', null, undefined, '水利工程'),
      getItem('测绘科学', '2-8-12', null, undefined, '测绘科学'),
      getItem('化学工程', '2-8-13', null, undefined, '化学工程'),
      getItem('地质工程学', '2-8-14', null, undefined, '地质工程学'),
      getItem('矿业工程学', '2-8-15', null, undefined, '矿业工程学'),
      getItem('石油天然气工程', '2-8-16', null, undefined, '石油天然气工程'),
      getItem('纺织科学', '2-8-17', null, undefined, '纺织科学'),
      getItem('轻工业学', '2-8-18', null, undefined, '轻工业学'),
      getItem('交通运输工程', '2-8-19', null, undefined, '交通运输工程'),
      getItem('船舶与海洋工程', '2-8-20', null, undefined, '船舶与海洋工程'),
      getItem('航空宇航科学', '2-8-21', null, undefined, '航空宇航科学'),
      getItem('兵器科学与技术', '2-8-22', null, undefined, '兵器科学与技术'),
      getItem('核科学与技术', '2-8-23', null, undefined, '核科学与技术'),
      getItem('生物工程学', '2-8-24', null, undefined, '生物工程学'),
      getItem('环境工程学', '2-8-25', null, undefined, '环境工程学'),
    ]),
    getItem('09  农学', '2-9', null, [
      getItem('农学', '2-9-1', null, undefined, '农学'),
      getItem('林学', '2-9-2', null, undefined, '林学'),
      getItem('园艺学', '2-9-3', null, undefined, '园艺学'),
      getItem('农业资源利用', '2-9-4', null, undefined, '农业资源利用'),
      getItem('植物保护', '2-9-5', null, undefined, '植物保护'),
      getItem('畜牧兽医', '2-9-6', null, undefined, '畜牧兽医'),
      getItem('水产学', '2-9-7', null, undefined, '水产学'),
      getItem('农业工程', '2-9-8', null, undefined, '农业工程'),
      getItem('农业经济管理', '2-9-9', null, undefined, '农业经济管理'),
    ]),
    getItem('10  医学', '2-10', null, [
      getItem('基础医学', '2-10-1', null, undefined, '基础医学'),
      getItem('临床医学', '2-10-2', null, undefined, '临床医学'),
      getItem('口腔医学', '2-10-3', null, undefined, '口腔医学'),
      getItem('预防医学', '2-10-4', null, undefined, '预防医学'),
      getItem('中医学', '2-10-5', null, undefined, '中医学'),
      getItem('中西医结合', '2-10-6', null, undefined, '中西医结合'),
      getItem('药学', '2-10-7', null, undefined, '药学'),
      getItem('中药学', '2-10-8', null, undefined, '中药学'),
      getItem('特种医学', '2-10-9', null, undefined, '特种医学'),
      getItem('法医学', '2-10-10', null, undefined, '法医学'),
      getItem('护理学', '2-10-11', null, undefined, '护理学'),
    ]),
    getItem('11  军事学', '2-11', null, [
      getItem('军事装备学', '2-11-1', null, undefined, '军事装备学'),
      getItem('战略学', '2-11-2', null, undefined, '战略学'),
      getItem('战役学', '2-11-3', null, undefined, '战役学'),
      getItem('战术学', '2-11-4', null, undefined, '战术学'),
      getItem('军队指挥学', '2-11-5', null, undefined, '军队指挥学'),
      getItem('军制学', '2-11-6', null, undefined, '军制学'),
      getItem('军队政治学', '2-11-7', null, undefined, '军队政治学'),
      getItem('军事后勤学', '2-11-8', null, undefined, '军事后勤学'),
      getItem('军事管理学', '2-11-9', null, undefined, '军事管理学'),
      getItem('军事历史学', '2-11-10', null, undefined, '军事历史学'),
      getItem('军事思想', '2-11-11', null, undefined, '军事思想'),
    ]),
    getItem('12  管理学', '2-12', null, [
      getItem('管理学', '2-12-1', null, undefined, '管理学'),
      getItem('工商管理', '2-12-2', null, undefined, '工商管理'),
      getItem('农林经济管理', '2-12-3', null, undefined, '农林经济管理'),
      getItem('公共管理', '2-12-4', null, undefined, '公共管理'),
      getItem('图书档案管理', '2-12-5', null, undefined, '图书档案管理'),
      getItem('交通运输管理', '2-12-6', null, undefined, '交通运输管理'),
      getItem('物流管理', '2-12-7', null, undefined, '物流管理'),
      getItem('工业工程', '2-12-8', null, undefined, '工业工程'),
      getItem('电子商务', '2-12-9', null, undefined, '电子商务'),
      getItem('旅游管理', '2-12-10', null, undefined, '旅游管理'),
    ]),
    getItem('13  艺术学', '2-13', null, [
      getItem('艺术学', '2-13-1', null, undefined, '艺术学'),
      getItem('音乐与舞蹈学', '2-13-2', null, undefined, '音乐与舞蹈学'),
      getItem('戏剧与影视学', '2-13-3', null, undefined, '戏剧与影视学'),
      getItem('美术学', '2-13-4', null, undefined, '美术学'),
      getItem('设计学', '2-13-5', null, undefined, '设计学'),
    ]),
  ]),
];
const App: React.FC = () => {
  //const [collapsed, setCollapsed] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [searchBooks, setSearchBooks] = useState<Book[]>();
  const [searchBooksInput, setSearchBooksInput] = useState('');
  const [option, setOption] = useState('书名');
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['1']);

  useEffect(() => {
    axios.get('/api/books/')
      .then((response) => {
        setBooks(response.data);
        setSearchBooks(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  function generateMenuItems(menuItems: MenuItem[]): React.ReactNode[] {
    return menuItems.map((item) => (
      item.children ? (
        <Menu.SubMenu key={item.key} title={item.label} icon={item.icon}>
          {generateMenuItems(item.children)}
        </Menu.SubMenu>
      ) : (
        <Menu.Item key={item.key} onClick={() => handleMenuItemClick(item.tag)}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {item.icon}
            <span>{item.label}</span>
          </div>
        </Menu.Item>
      )
    ));
  }

  const handleMenuItemClick = (tag?: string) => {
    // 使用 tag 值执行搜索逻辑
    if (tag) {
      let filteredBooks: Book[] = books?.filter((book) => book.tag === tag);
      setSearchBooks(filteredBooks);
    }
    // 否则，返回到首页
    else {
      setSearchBooks(books);
    }
  };
  const onSearch = (value: string, selectedOption: string) => {
    setSearchBooksInput(value);

    if (value !== '') {
      let filteredBooks: Book[] = [];
      if (selectedOption === '书名') {
        filteredBooks = books?.filter((book) => book.book.toLowerCase().includes(value.toLowerCase()));
      } else if (selectedOption === '作者') {
        filteredBooks = books?.filter((book) => book.author.toLowerCase().includes(value.toLowerCase()));
      }
      setSearchBooks(filteredBooks);
    } else {
      setSearchBooks(books);
    }
  };
  const buttonSpacing = {
    marginRight: '10px',
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        style={{
          overflowY: 'auto',
          height: '100vh',
          position: 'sticky',
          left: 0,
          top: 0,
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          {generateMenuItems(menuItems)}
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: colorBgContainer,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Select
              defaultValue="书名"
              style={{ width: 80, marginRight: 16 }}
              onChange={(opt) => setOption(opt)}
            >
              <Option value="书名">书名</Option>
              <Option value="作者">作者</Option>
            </Select>
            <Input.Search
              placeholder="请输入搜索内容"
              onSearch={(value) => onSearch(value, option)}
              enterButton
              style={{ width: 400 }}
            />
          </div>
        </Header>
        <Content
          style={{
            margin: '0 16px',
            overflowY: 'auto',
            minHeight: '100vh',
          }}
        >
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: (page) => {
                console.log(page);
              },
              pageSize: 8,
            }}
            dataSource={searchBooks}
            renderItem={(book) => (
              <List.Item
                key={book.book}
              >
                <div style={{ display: 'flex' }}>
                  <div style={{ marginRight: '20px' }}>
                    <img width={100} alt="logo" src={`/static/${book.image}`} />

                  </div>
                  <div>
                    <List.Item.Meta
                      title={<a href={`/book_comment/${book.id}`}>{book.book}</a>}
                      description={`${book.author}, ${book.publisher}, ${book.tag}`}
                    />
                    {book.instruction}
                  </div>
                </div>
              </List.Item>
            )}
          />
          <div
            style={{
              position: 'fixed',
              bottom: 20,
              right: 20,
            }}
          >
            <Button
              type="primary"
              shape="circle"
              icon={<PlusCircleOutlined />}
              size="large"
              href='/intro'
            />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©2023 Created by 666
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
