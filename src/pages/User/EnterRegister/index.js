import React, { PureComponent, Fragment } from 'react';
import { Steps, Divider, Row, Col } from 'antd';
import styles from './index.less';

const { Step } = Steps;

export default class StepForm extends PureComponent {
  state = {
    list: [
      { title: '账号注册', info: '1.管理员手机号', key: '1' },
      {
        title: '企业认证',
        info: (
          <p style={{ fontSize: 14 }}>
            1.企业三证影印件
            <br /> 2.法人身份影印件
            <br /> 3.管理员身份影印件
          </p>
        ),
        key: '2',
      },
      { title: '绑定账户', info: '1.企业一般结算户', key: '3' },
      { title: '立即使用', key: '4' },
    ],
  };

  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'enter-account':
        return 0;
      case 'enter-authentication':
        return 1;
      case 'enter-binding':
        return 2;
      default:
        return 0;
    }
  }

  render() {
    const { children } = this.props;
    const { list } = this.state;

    return (
      <div>
        <div className={styles.main}>{children}</div>
        {/* <Form layout='horizontal' {...formItemLayout}>
          <Row style={{ paddingLeft: 24, paddingRight: 24 }}>
            <Col xl={24} lg={24} md={24} sm={24}>
              <div className={styles.main}>{children}</div>
            </Col>
          </Row>
        </Form> */}
        <Divider />
        <Row style={{ paddingLeft: 24, paddingRight: 24 }}>
          <Col xl={24} lg={24} md={24} sm={24}>
            <Fragment>
              <Steps current={this.getCurrentStep()}>
                {list.map(item => {
                  return (
                    <Step
                      key={item.key}
                      title={<span style={{ fontSize: 14 }}>{item.title}</span>}
                      description={<span style={{ fontSize: 15 }}>{item.info}</span>}
                    />
                  );
                })}
              </Steps>
            </Fragment>
          </Col>
        </Row>
      </div>
    );
  }
}
