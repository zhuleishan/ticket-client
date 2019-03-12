import React, { PureComponent, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Link } from 'dva/router'; // 1.跳转
import { Button, Icon, Card } from 'antd';
import Result from '@/components/Result';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

class Error extends PureComponent {
  state = {};

  render() {
    const { infoList } = this.props;
    console.log(infoList);
    const extra = (
      <Fragment>
        <div
          style={{
            fontSize: 16,
            color: 'rgba(0, 0, 0, 0.85)',
            fontWeight: '500',
            marginBottom: 16,
          }}
        >
          <FormattedMessage
            id="app.result.error.hint-title"
            defaultMessage="The content you submitted has the following error:"
          />
        </div>

        {infoList.map(item => {
          return (
            <div style={{ marginBottom: 16 }} key={item.key}>
              <Icon style={{ color: '#f5222d', marginRight: 8 }} type="close-circle-o" />
              {item.text}
              <Link to={item.url} style={{ marginLeft: 16 }}>
                {item.btnName}
                <Icon type="right" />
              </Link>
            </div>
          );
        })}
      </Fragment>
    );

    const actions = <Button type="primary">返回列表</Button>;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Result
            type="error"
            title={formatMessage({ id: 'app.result.error.title' })}
            description={formatMessage({ id: 'app.result.error.description' })}
            extra={extra}
            actions={actions}
            style={{ marginTop: 48, marginBottom: 16 }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Error;
