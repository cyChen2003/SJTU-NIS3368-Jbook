import React from 'react';
import './index.css';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';

const Help: React.FC = () => (
  <>
    <FloatButton
      onClick={(event: React.MouseEvent<HTMLElement>) => {
        window.location.href = "https://www.bilibili.com";
      }}
      icon={<QuestionCircleOutlined />}
      type="default"
      style={{ right: 24 }}

    />
  </>
);

export default Help;