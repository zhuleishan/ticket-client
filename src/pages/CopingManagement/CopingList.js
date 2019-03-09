import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  // Select,
  Icon,
  Button,
  // Dropdown,
  // Menu,
  // InputNumber,
  Table,
  DatePicker,
  // Modal,
  // message,
  // Badge,
  Divider,
  // Steps,
  // Radio,
} from 'antd';
// import StandardTable from '@/components/StandardTable';
import styles from './CopingList.less';

const FormItem = Form.Item;
// const { Option } = Select;
// 时间格式
const dateFormat = 'YYYY/MM/DD';

const title = () => (
  <Row className={styles.importBox}>
    {' '}
    <Col span={8}>
      <strong>应付明细</strong>
    </Col>
    <Col span={8} offset={8} style={{ textAlign: 'right' }}>
      <Button type="primary">手工录入</Button>
      <Button type="primary">批量导入</Button>
      <Button>下载模板</Button>
    </Col>{' '}
  </Row>
);

/* eslint react/no-multi-comp:0 */
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class CopingList extends PureComponent {
  state = {
    // modalVisible: false,
    // updateModalVisible: false,
    expandForm: false,
    // selectedRows: [],
    formValues: {},
    title,
    // stepFormValues: {},
  };

  // 钩子函数
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }

  // 分页
  handlePageChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };

  // 重置查询条件
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

  // 展开收起
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  // 查询
  handleSearch = e => {
    e.preventDefault();
    let values;
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue.dateone);
      if (fieldsValue.dateone !== undefined && fieldsValue.datetwo === undefined) {
        values = {
          ...fieldsValue,
          dateone: fieldsValue.dateone.format('YYYY-MM-DD'),
        };
      }
      if (fieldsValue.datetwo !== undefined && fieldsValue.dateone === undefined) {
        values = {
          ...fieldsValue,
          datetwo: fieldsValue.datetwo.format('YYYY-MM-DD'),
        };
      }
      if (fieldsValue.datetwo === undefined && fieldsValue.dateone === undefined) {
        values = {
          ...fieldsValue,
        };
      }
      if (fieldsValue.dateone !== undefined && fieldsValue.datetwo !== undefined) {
        values = {
          ...fieldsValue,
          dateone: fieldsValue.dateone.format('YYYY-MM-DD'),
          datetwo: fieldsValue.datetwo.format('YYYY-MM-DD'),
        };
      }
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  // 收起状态form
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="凭证编号">
              {getFieldDecorator('name')(<Input placeholder="请输入凭证编号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="收款方">
              {getFieldDecorator('status')(<Input placeholder="请输入收款方" />)}
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

  // 展开状态form
  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="凭证编号">
              {getFieldDecorator('name')(<Input placeholder="请输入凭证编号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="收款方">
              {getFieldDecorator('status')(<Input placeholder="请输入收款方" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="立账日期">
              {getFieldDecorator('dateone')(
                <DatePicker
                  style={{ width: '100%' }}
                  format={dateFormat}
                  allowClear={false}
                  placeholder="请输入立账日期"
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="承诺付款日">
              {getFieldDecorator('datetwo')(
                <DatePicker
                  style={{ width: '100%' }}
                  format={dateFormat}
                  allowClear={false}
                  placeholder="请输入承诺付款日"
                />
              )}
            </FormItem>
          </Col>
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
        </Row>
      </Form>
    );
  }

  // 展开收起form函数
  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      rule: {
        data: { list, pagination },
      },
      loading,
    } = this.props;
    const paginationProps = {
      ...pagination,
    };
    const columns = [
      {
        title: '凭证编号',
        dataIndex: 'key',
        // sorter: true,
        align: 'center',
      },
      {
        title: '凭证类型',
        dataIndex: 'owner',
        align: 'center',
      },
      {
        title: '收款方',
        dataIndex: 'href',
        align: 'center',
      },
      {
        title: '凭证金额',
        dataIndex: 'progress',
        sorter: true,
        render: val => `${val} 元`,
        align: 'center',
      },
      {
        title: '应付金额',
        dataIndex: 'callNo',
        sorter: true,
        render: val => `${val} 元`,
        align: 'center',
      },
      {
        title: '立账日期',
        dataIndex: 'updatedAt',
        align: 'center',
        // sorter: true,
      },
      {
        title: '承诺付款日',
        dataIndex: 'createdAt',
        align: 'center',
        // sorter: true,
      },
      {
        title: '备注',
        dataIndex: 'desc',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'status',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'test',
        key: 'test',
        align: 'center',
        render: () => (
          <span>
            <a href="">开具</a>
            <Divider type="vertical" />
            <a href="">删除</a>
          </span>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="应付管理">
        <Card bordered={false} style={{ background: '#ECECEC' }} className={styles.topBox}>
          <div>
            <Row gutter={8}>
              <Col span={6}>
                <Card title="授信额度" bordered={false} className={styles.effective}>
                  <strong>2000000元</strong>
                  <span>有效</span>
                </Card>
              </Col>
              <Col span={6}>
                <Card title="可用额度" bordered={false}>
                  <strong>2000000元</strong>
                </Card>
              </Col>
              <Col span={6}>
                <Card title="已用额度" bordered={false}>
                  <strong>2000000元</strong>
                </Card>
              </Col>
              <Col span={6}>
                <Card title="冻结额度" bordered={false}>
                  <strong>2000000元</strong>
                </Card>
              </Col>
            </Row>
          </div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
          </div>
          <div className={styles.standardTable}>
            <Table
              {...this.state}
              dataSource={list}
              loading={loading}
              columns={columns}
              pagination={{
                current: paginationProps.current,
                pageSize: paginationProps.pageSize,
                total: paginationProps.total,
                showQuickJumper: true,
                showSizeChanger: true,
              }}
              onChange={this.handlePageChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default CopingList;
