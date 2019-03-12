import React, { PureComponent, Fragment } from 'react';
import { Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

export default class StepForm extends PureComponent {
  render() {
    const { location, children } = this.props;
    return (
      <PageHeaderWrapper title="凭证查询" tabActiveKey={location.pathname}>
        <Card bordered={false}>
          <Fragment>{children}</Fragment>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
