import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

/* eslint react/no-multi-comp:0 */
@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class AuditingList extends PureComponent {
  render() {
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div>13213213</div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AuditingList;
