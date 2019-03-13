import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import numeral from 'numeral';
import {
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Icon,
  InputNumber,
  DatePicker,
  Tabs,
  Badge,
  Card,
  List,
} from 'antd';
import styles from './style.less';

const data = ['Racing car sprays burning fuel into crowd.'];
const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;
const paginationProps = {
  showSizeChanger: true,
  showQuickJumper: true,
  ...{ current: 1, pageSize: 10, total: 46 },
};
@connect(({ form }) => ({
  data: form.step,
}))
@Form.create()
class Step1 extends React.PureComponent {
  state = {
    expandForm: false,
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({});
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };

      this.setState({});

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  callback = key => {
    console.log(key);
  };

  // eslint-disable-next-line class-methods-use-this
  renderSimpleForms() {
    return (
      <Row>
        <List
          itemLayout="vertical"
          className={styles.credentialsquerylist}
          pagination={paginationProps}
          dataSource={data}
          size="large"
          renderItem={item => (
            <List.Item key={item.id}>
              <Card
                style={{ width: '100%' }}
                title={
                  <Col>
                    {' '}
                    <Button type="primary" ghost style={{ marginRight: '10px' }}>
                      付款承诺函
                    </Button>
                    <span>T2018090820</span>
                  </Col>
                }
                extra={
                  <Col>
                    <Link to="/Instrumentagents/credentialsquery/payand">
                      <Button type="primary" style={{ marginRight: '10px' }}>
                        签收
                      </Button>
                    </Link>
                    <Button type="primary" style={{ marginRight: '10px' }}>
                      融资
                    </Button>
                    <Button type="primary">转让</Button>
                  </Col>
                }
                cover={
                  <Row style={{ borderBottom: '1px solid #e8e8e8', padding: '24px 32px' }}>
                    <Col md={7} sm={24}>
                      <div>转让方</div>
                      <h3>青建股份有限公司</h3>
                      <div>接收方</div>
                      <h3>河北钢铁有限公司</h3>
                    </Col>
                    <Col md={7} sm={24}>
                      <div>开立方</div>
                      <h3>青建股份有限公司</h3>
                    </Col>
                    <Col md={7} sm={24}>
                      <div>持有金额</div>
                      <h1>{numeral(10003.01).format('0,0.00')}</h1>
                    </Col>
                    <Col md={3} sm={24} style={{ textAlign: 'right' }}>
                      详情
                    </Col>
                  </Row>
                }
              >
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={5} sm={24}>
                    开证日期：2015-09-09
                  </Col>
                  <Col md={5} sm={24}>
                    接收日期：2015-09-09
                  </Col>
                  <Col md={5} sm={24}>
                    承诺付款日：2015-09-09
                  </Col>
                  <Col md={5} sm={24}>
                    到期天数:169 天
                  </Col>
                  <Col md={4} sm={24} style={{ textAlign: 'right' }}>
                    待兑付
                  </Col>
                </Row>
              </Card>
            </List.Item>
          )}
        />
      </Row>
    );
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="开立方">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="支付方">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="开立方">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="支付方">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="接收方">
              {getFieldDecorator('number')(<InputNumber style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="凭证状态">
              {getFieldDecorator('date')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="承诺付款日">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
                <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  收起 <Icon type="up" />
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    return (
      <Fragment>
        <Col className={styles.tableListForm}>{this.renderForm()}</Col>
        <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab="全部" key="1" />
          <TabPane
            tab={
              <Badge count={8}>
                <Col style={{ marginRight: 8 }}>我的开具</Col>
              </Badge>
            }
            key="2"
          />
          <TabPane
            tab={
              <Badge count={9}>
                <Col style={{ marginRight: 8 }}>我收到的</Col>
              </Badge>
            }
            key="3"
          />
        </Tabs>
        <Col>{this.renderSimpleForms()}</Col>
      </Fragment>
    );
  }
}

export default Step1;
