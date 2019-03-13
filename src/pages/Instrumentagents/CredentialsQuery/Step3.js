import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import { formatMessage } from 'umi/locale';
import Bind from 'lodash-decorators/bind';
import { routerRedux } from 'dva/router';
import { Steps, Card, Popover, Form, Col, Row, Input, Checkbox, Button, Modal, Alert } from 'antd';
import numeral from 'numeral';
import styles from './Step2.less';
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
class Step2 extends Component {
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

  handleOk = () => {
    const { dispatch } = this.props;
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
      dispatch(routerRedux.push('examine-success'));
    }, 1000);
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    this.setState({
      visible: false,
    });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
      dispatch(routerRedux.push('examine-error'));
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
    const specialLayout = {
      wrapperCol: {
        xl: { span: 24 },
        sm: { span: 24 },
      },
    };
    return (
      <Fragment>
        <Card title="流程状态" style={{ marginBottom: 24 }} bordered={false}>
          <Steps direction={stepDirection} progressDot={customDot} current={1}>
            <Step title="申请开票" />
            <Step title="开票复核" />
            <Step title="凭证签收" />
          </Steps>
        </Card>
        <Card
          title="凭证信息"
          style={{ marginBottom: 24 }}
          bordered={false}
          extra={
            <Col>
              <Button type="primary" style={{ marginRight: '10px' }}>
                打印凭证
              </Button>
              <Button type="primary">打印表单</Button>
            </Col>
          }
        >
          <Form {...formItemLayout}>
            <Row gutter={16}>
              <Col
                xl={{ span: 12, push: 6 }}
                lg={{ span: 12, push: 6 }}
                md={{ span: 12, push: 6 }}
                sm={24}
              >
                <Form.Item label="转让方">
                  <Input placeholder="请输入转让方" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col
                xl={{ span: 12, push: 6 }}
                lg={{ span: 12, push: 6 }}
                md={{ span: 12, push: 6 }}
                sm={24}
              >
                <Form.Item label="可转金额">
                  <Col>
                    <h1>¥{numeral(10003.01).format('0,0.00')}</h1>
                  </Col>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col
                className={styles.credentialspayand}
                xl={{ span: 12, push: 6 }}
                lg={{ span: 12, push: 6 }}
                md={{ span: 12, push: 6 }}
                sm={24}
              >
                <Alert message="转让金额不能大于持有金额" type="success" showIcon closable />
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="转让信息" className={styles.card} bordered={false}>
          <Form {...formItemLayout}>
            <Row gutter={16}>
              <Col xl={12} lg={12} md={12} sm={24}>
                <Form.Item label="转让方">
                  <Input placeholder="请输入转让方" />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24}>
                <Form.Item label="转让金额">
                  <Input prefix="￥" placeholder="请输入转让金额" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xl={12} lg={12} md={12} sm={24}>
                <Form.Item label="承诺付款日">
                  <Input placeholder="请输入承诺付款日" />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24}>
                <Form.Item label="到期期限">
                  <Input suffix="天" placeholder="请输入到期期限" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xl={12} lg={12} md={12} sm={24}>
                <Form.Item label="转让日期">
                  <Input placeholder="请输入仓库名称" />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24}>
                <Form.Item label="付款承诺函编号">
                  <Input placeholder="请输入付款承诺函编号" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xl={12} lg={12} md={12} sm={24}>
                <Form.Item label="经办人">
                  <Input placeholder="请输入经办人" />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24}>
                <Form.Item label="联系方式">
                  <Input placeholder="请输入联系方式" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xl={12} lg={12} md={12} sm={24}>
                <Form.Item label="备注">
                  <TextArea style={{ minHeight: 32 }} placeholder="请输入备注" rows={4} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="贸易信息" bordered={false}>
          {getFieldDecorator('members', {
            initialValue: tableData,
          })(<TradePairsTable title="合同信息" />)}
          {getFieldDecorator('members', {
            initialValue: tableData,
          })(<TradePairsTable title="发票信息" />)}
          {getFieldDecorator('members', {
            initialValue: tableData,
          })(<TradePairsTable title="其他信息" />)}
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
                    阅读并同意<a href="">《凭证支付协议》</a>
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
          title="凭证支付信息确认"
          width={750}
          onOk={this.ModalhandleOk}
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
                <Form.Item label="接收方">请输入仓库名称</Form.Item>
              </Col>
              <Col xl={24} lg={24} md={24} sm={24}>
                <Form.Item label="支付金额">请输入仓库名称</Form.Item>
              </Col>
              <Col xl={24} lg={24} md={24} sm={24}>
                <Form.Item label="支付日期">请输入仓库名称</Form.Item>
              </Col>
              <Col xl={24} lg={24} md={24} sm={24}>
                <Form.Item label="承诺付款日">请输入仓库名称</Form.Item>
              </Col>
              <Col xl={24} lg={24} md={24} sm={24}>
                <Form.Item label="付款承诺函号">请输入仓库名称</Form.Item>
              </Col>
              <Col xl={24} lg={24} md={24} sm={24}>
                <Form.Item label="经办人">请输入仓库名称</Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

export default Step2;
