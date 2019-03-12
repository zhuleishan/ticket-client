import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router'; // 1.跳转
// import { routerRedux } from 'dva/router';  2.跳转
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
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
import styles from './AuditingList.less';

const FormItem = Form.Item;
// const { Option } = Select;
const dateFormat = 'YYYY/MM/DD';
const { RangePicker } = DatePicker;
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
class AuditingList extends PureComponent {
  state = {
    // modalVisible: false,
    // updateModalVisible: false,
    expandForm: false,
    // selectedRows: [],
    formValues: {},
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

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        startData: fieldsValue.startData ? fieldsValue.startData.format('YYYY-MM-DD') : undefined,
        endData:
          fieldsValue.endData && fieldsValue.endData.lenght
            ? [
                fieldsValue.endData[0].format('YYYY-MM-DD'),
                fieldsValue.endData[1].format('YYYY-MM-DD'),
              ].join(',')
            : undefined,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });

      // dispatch(routerRedux.push('/instrumentagents/auditing-view')); 2.跳转

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
            <FormItem label="凭证单号">
              {getFieldDecorator('name')(<Input placeholder="请输入凭证单号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="开立方">
              {getFieldDecorator('status')(<Input placeholder="请输入开立方" />)}
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
            <FormItem label="凭证单号">
              {getFieldDecorator('name')(<Input placeholder="请输入凭证单号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="开立方">
              {getFieldDecorator('status')(<Input placeholder="请输入开立方" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="接收方">
              {getFieldDecorator('number')(
                <Input style={{ width: '100%' }} placeholder="请输入接收方" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="申请人">
              {getFieldDecorator('number')(
                <Input style={{ width: '100%' }} placeholder="请输入申请人" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="承诺付款日">
              {getFieldDecorator('startData')(
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="请选择承诺付款日"
                  format={dateFormat}
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="申请时间">
              {getFieldDecorator('endData')(
                <RangePicker style={{ width: '100%' }} format={dateFormat} />
              )}
            </FormItem>
          </Col>
        </Row>
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
        title: '服务调用次数',
        dataIndex: 'callNo',
        render: val => `${val} 万`,
        needTotal: true,
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
      {
        title: '上次调度时间',
        dataIndex: 'updatedAt',
        render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '操作',
        dataIndex: 'test',
        key: 'test',
        render: () => (
          <span>
            <Link to="/instrumentagents/auditing-view">查看</Link>
            {/* <Link to={`/instrumentagents/auditing-view/${val}`}>查看</Link>   1.跳转   */}
            <Divider type="vertical" />
            <a href="">审核</a>
          </span>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="凭证审核">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
          </div>
          <div className={styles.standardTable}>
            <Table
              dataSource={list}
              loading={loading}
              columns={columns}
              pagination={{
                current: paginationProps.current,
                pageSize: paginationProps.pageSize,
                total: paginationProps.total,
                pageSizeOptions: ['10', '20', '30'],
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
export default AuditingList;
