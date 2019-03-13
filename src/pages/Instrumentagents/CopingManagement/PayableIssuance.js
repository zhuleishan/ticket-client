import React, { Component } from 'react';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { routerRedux } from 'dva/router';
import { formatMessage } from 'umi/locale';
import { Steps, Card, Popover, Form, Col, Row, Input, Checkbox, Button, Modal, Alert } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import { numericLiteral } from '@babel/types';
import styles from './PayableIssuance.less';
import TradePairsTable from '@/components/TradePairsTable';

const { Step } = Steps;
const { TextArea } = Input;
const tableData = [];
const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;
const customDot = (dot, { status }) =>
  status === 'process' ? (
    <Popover placement="topLeft" arrowPointAtCenter>
      {dot}
    </Popover>
  ) : (
    dot
  );
@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class PayableIssuance extends Component {
  state = {
    stepDirection: 'horizontal',
    visible: false,
    loading: false,
  };

  // 钩子函数
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
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

  showModal = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields({ force: true }, err => {
      if (!err) {
        this.setState({
          visible: true,
        });
      }
    });
  };

  agreementCheck = (rule, value, callback) => {
    if (!value) {
      callback(formatMessage({ id: 'validation.agreement.required' }));
    } else {
      callback();
    }
  };

  handleOk = e => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
      dispatch(routerRedux.push('examine-success'));
    }, 1000);
  };

  handleCancel = e => {
    e.preventDefault();
    // const { dispatch } = this.props;
    this.setState({
      visible: false,
    });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
      // dispatch(routerRedux.push('examine-error'));
    }, 1000);
  };

  render() {
    const { stepDirection, visible, loading } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xl: { span: 4 },
        sm: { span: 24 },
      },
      wrapperCol: {
        xl: { span: 20 },
        sm: { span: 24 },
      },
    };
    // const ModalLayout = {
    //   labelCol: {
    //     xl: { span: 4 },
    //     sm: { span: 24 },
    //   },
    //   wrapperCol: {
    //     xl: { span: 20 },
    //     sm: { span: 24 },
    //   },
    // };
    const specialLayout = {
      wrapperCol: {
        xl: { span: 24 },
        sm: { span: 24 },
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
          <Steps direction={stepDirection} progressDot={customDot} current={0}>
            <Step title="凭证开立" />
            <Step title="凭证审核" />
            <Step title="凭证签收" />
            <Step title="完成" />
          </Steps>
        </Card>
        <Card title="我的开票额度" className={styles.card} bordered={false}>
          <Form {...formItemLayout} className={styles.myQuota}>
            <Row>
              <Col xl={24} lg={24} md={24} sm={24}>
                <Form.Item label="开立方">
                  <Input placeholder="请输入开立方" />
                </Form.Item>
              </Col>
              <Col xl={24} lg={24} md={24} sm={24}>
                <Form.Item label="可用额度">
                  {/* <Input placeholder="请输入仓库名称" /> */}
                  <h1>￥1000000</h1>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="开证信息" className={styles.card} bordered={false}>
          <Form {...formItemLayout}>
            <Row gutter={16}>
              <Col xl={12} lg={12} md={12} sm={24}>
                <Form.Item label="收证方">
                  <Input placeholder="请输入收证方" />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24}>
                <Form.Item label="开证金额">
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
                <Form.Item label="到期期限">
                  <Input prefix="￥" placeholder="请输入仓库名称" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xl={12} lg={12} md={12} sm={24}>
                <Form.Item label="立账日期">
                  <Input prefix="￥" placeholder="请输入仓库名称" />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24}>
                <Form.Item label="对账编号">
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
              <Col xl={12} lg={12} md={12} sm={24}>
                <Form.Item label="备注">
                  <TextArea style={{ minHeight: 32 }} placeholder="请输入仓库名称" rows={4} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="贸易信息" bordered={false}>
          {getFieldDecorator('members', {
            initialValue: tableData,
          })(<TradePairsTable title="合同信息" />)}
          <Row>
            <Col xl={24} lg={24} md={24} sm={24} className={styles.TextCenter}>
              <Form.Item {...specialLayout}>
                {getFieldDecorator('agreement', {
                  rules: [
                    {
                      validator: this.agreementCheck,
                    },
                  ],
                })(
                  <Checkbox>
                    阅读并同意<a href="">《开具协议》《付款承诺函》</a>
                  </Checkbox>
                )}
              </Form.Item>
            </Col>
            <Col xl={24} lg={24} md={24} sm={24} className={styles.TextCenter}>
              <Form.Item {...specialLayout}>
                <Button htmlType="submit" size="large">
                  取消
                </Button>
                <Button
                  onClick={this.showModal}
                  style={{ marginLeft: 20 }}
                  type="primary"
                  htmlType="submit"
                  size="large"
                >
                  确认
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Modal
          visible={visible}
          title="凭证开立信息确认"
          width={750}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              返回
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
              审核人Ukey确认
            </Button>,
          ]}
        >
          <Alert message="未检测到U盾，请确认是否插入!" type="error" showIcon closable />
          <Form {...formItemLayout}>
            <Row>
              <Col xl={24} lg={24} md={24} sm={24}>
                <Form.Item label="收证方">请输入仓库名称</Form.Item>
              </Col>
              <Col xl={24} lg={24} md={24} sm={24}>
                <Form.Item label="开证金额">请输入仓库名称</Form.Item>
              </Col>
              <Col xl={24} lg={24} md={24} sm={24}>
                <Form.Item label="开立日期">请输入仓库名称</Form.Item>
              </Col>
              <Col xl={24} lg={24} md={24} sm={24}>
                <Form.Item label="承诺付款日">请输入仓库名称</Form.Item>
              </Col>
              <Col xl={24} lg={24} md={24} sm={24}>
                <Form.Item label="对账单号">请输入仓库名称</Form.Item>
              </Col>
              <Col xl={24} lg={24} md={24} sm={24}>
                <Form.Item label="经办人">请输入仓库名称</Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default PayableIssuance;
