import React, { PureComponent, Fragment } from 'react';
import { Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

export default class StepForm extends PureComponent {
  routerSwitch = children => {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'index':
        return (
          <Card bordered={false}>
            <Fragment>{children}</Fragment>
          </Card>
        );
      default:
        return <Fragment>{children}</Fragment>;
    }
  };

  render() {
    const { location, children } = this.props;
    return (
      <PageHeaderWrapper title="凭证查询" tabActiveKey={location.pathname}>
        {this.routerSwitch(children)}
      </PageHeaderWrapper>
    );
  }
}
