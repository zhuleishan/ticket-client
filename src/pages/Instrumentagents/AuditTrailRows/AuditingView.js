import React, { Component } from 'react';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { Steps, Card, Popover, Form, Col, Row, Input } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './AuditingView.less';

const { Step } = Steps;
const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;
const customDot = (dot, { status }) =>
  status === 'process' ? (
    <Popover placement="topLeft" arrowPointAtCenter>
      {dot}
    </Popover>
  ) : (
    dot
  );
@connect(({ profile, loading }) => ({
  profile,
  loading: loading.effects['profile/fetchAdvanced'],
}))
class AuditingView extends Component {
  state = {
    stepDirection: 'horizontal',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'profile/fetchAdvanced',
    });

    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
    this.setStepDirection.cancel();
  }

  @Bind()
  @Debounce(200)
  setStepDirection() {
    const { stepDirection } = this.state;
    const w = getWindowWidth();
    if (stepDirection !== 'vertical' && w <= 576) {
      this.setState({
        stepDirection: 'vertical',
      });
    } else if (stepDirection !== 'horizontal' && w > 576) {
      this.setState({
        stepDirection: 'horizontal',
      });
    }
  }

  render() {
    const { stepDirection } = this.state;
    const formItemLayout = {
      labelCol: {
        xl: { span: 4 },
        sm: { span: 24 },
      },
      wrapperCol: {
        xl: { span: 14 },
        md: { span: 14 },
      },
    };
    return (
      <PageHeaderWrapper
        title="单号：234231029431"
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
      >
        <Card title="开具流程" style={{ marginBottom: 24 }} bordered={false}>
          <Steps direction={stepDirection} progressDot={customDot} current={1}>
            <Step title="创建项目" />
            <Step title="部门初审" />
            <Step title="财务复核" />
            <Step title="完成" />
          </Steps>
        </Card>
        <Card title="凭证信息" className={styles.card} bordered={false}>
          <Form {...formItemLayout}>
            <Row gutter={16}>
              <Col xl={12} lg={12} md={12} sm={24}>
                <Form.Item label="开立方" className={styles.label}>
                  <Input placeholder="请输入仓库名称" />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24}>
                <Form.Item label="接收方">
                  <Input placeholder="请输入仓库名称" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xl={12} lg={12} md={12} sm={24}>
                <Form.Item label="对账编号">
                  <Input placeholder="请输入仓库名称" />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24}>
                <Form.Item label="应付金额">
                  <Input placeholder="请输入仓库名称" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xl={12} lg={12} md={12} sm={24}>
                <Form.Item label="开立金额">
                  <Input placeholder="请输入仓库名称" />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24}>
                <Form.Item label="开立日期">
                  <Input placeholder="请输入仓库名称" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xl={12} lg={12} md={12} sm={24}>
                <Form.Item label="承诺付款日">
                  <Input placeholder="请输入仓库名称" />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24}>
                <Form.Item label="剩余期限">
                  <Input placeholder="请输入仓库名称" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xl={12} lg={12} md={12} sm={24}>
                <Form.Item label="经办人">
                  <Input placeholder="请输入仓库名称" />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24}>
                <Form.Item label="联系方式">
                  <Input placeholder="请输入仓库名称" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xl={24} lg={12} md={12} sm={24}>
                <Form.Item label="经办人">
                  <Input placeholder="请输入仓库名称" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AuditingView;
