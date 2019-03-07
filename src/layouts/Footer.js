import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: '磁云首页',
          title: '磁云首页',
          href: 'https://www.iciyun.com',
          blankTarget: true,
        },
        // {
        //   key: 'github',
        //   title: <Icon type="github" />,
        //   href: 'https://github.com/ant-design/ant-design-pro',
        //   blankTarget: true,
        // },
        // {
        //   key: 'Ant Design',
        //   title: 'Ant Design',
        //   href: 'https://ant.design',
        //   blankTarget: true,
        // },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2019 磁云金服体验技术部出品
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
