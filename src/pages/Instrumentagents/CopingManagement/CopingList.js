import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router'; // 1.跳转
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  // Dropdown,
  // Menu,
  InputNumber,
  Table,
  DatePicker,
  Modal,
  message,
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
const SelectOption = Select.Option;
const TextArea = Input;

/* eslint react/no-multi-comp:0 */
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const {
    form: { getFieldDecorator },
  } = props;
  const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };
  const okHandle = e => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        createdAt: fieldsValue.createdAt ? fieldsValue.createdAt.format('YYYY-MM-DD') : undefined,
        paymentDate: fieldsValue.paymentDate
          ? fieldsValue.paymentDate.format('YYYY-MM-DD')
          : undefined,
      };
      handleAdd(values);
      form.resetFields();
    });
  };
  function disabledDate(current) {
    // 不能选择今天和小于今天的时间
    return current && current < moment().endOf('day');
  }

  return (
    <Modal
      destroyOnClose
      title="新建规则"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form className={styles.manualInput}>
        <FormItem label="收款方" {...formLayout}>
          {getFieldDecorator('title', {
            rules: [{ required: true, message: '请输入收款方' }],
          })(
            <Select placeholder="请选择">
              <SelectOption value="付晓晓">付晓晓</SelectOption>
              <SelectOption value="周毛毛">周毛毛</SelectOption>
            </Select>
          )}
        </FormItem>
        <FormItem label="凭证类型" {...formLayout}>
          {getFieldDecorator('owner', {
            rules: [{ required: true, message: '请选择凭证类型' }],
          })(
            <Select placeholder="请选择">
              <SelectOption value="付晓晓">付晓晓</SelectOption>
              <SelectOption value="周毛毛">周毛毛</SelectOption>
            </Select>
          )}
        </FormItem>
        <FormItem label="对账编号" {...formLayout}>
          {getFieldDecorator('numberS', {
            rules: [{ required: true, message: '请输入对账编号' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label="凭证金额" {...formLayout}>
          {getFieldDecorator('voucherAmount', {
            rules: [{ required: true, message: '请输入凭证金额' }],
          })(
            <InputNumber
              formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/￥\s?|(,*)/g, '')}
            />
          )}
        </FormItem>
        <FormItem label="立账日期" {...formLayout}>
          {getFieldDecorator('createdAt', {
            rules: [{ required: true, message: '请选择立账日期' }],
          })(<DatePicker placeholder="请选择" format="YYYY-MM-DD" style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label="应付金额" {...formLayout}>
          {getFieldDecorator('amountPayable', {
            rules: [{ required: true, message: '请输入应付金额' }],
          })(
            <InputNumber
              formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/￥\s?|(,*)/g, '')}
            />
          )}
        </FormItem>
        <FormItem label="承诺付款日" {...formLayout}>
          {getFieldDecorator('paymentDate', {
            rules: [{ required: true, message: '请选择承诺付款日' }],
          })(
            <DatePicker
              placeholder="请选择"
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
              disabledDate={disabledDate}
            />
          )}
        </FormItem>
        <FormItem {...formLayout} label="备注">
          {getFieldDecorator('subDescription')(<TextArea rows={4} />)}
        </FormItem>
      </Form>
    </Modal>
  );
});
@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class CopingList extends PureComponent {
  state = {
    expandForm: false,
    formValues: {},
    visible: false,
    done: false,
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
        dateone: fieldsValue.dateone ? fieldsValue.dateone.format('YYYY-MM-DD') : undefined,
        datetwo: fieldsValue.datetwo ? fieldsValue.datetwo.format('YYYY-MM-DD') : undefined,
      };
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  // 弹窗显示
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  // 手动录入提交
  handleAdd = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetchquery',
      payload: values,
    });

    message.success('添加成功');
    this.handleModalVisible();
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
              <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
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

    const { modalVisible } = this.state;
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
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    return (
      <PageHeaderWrapper title="应付管理">
        <Card bordered={false}>
          <Row>
            <Col xs={24} lg={6}>
              <Info title="授信额度" value="2000000元" bordered />
              {/* <span>有效</span> */}
            </Col>
            <Col xs={24} lg={6}>
              <Info title="可用额度" value="32分钟" bordered />
            </Col>
            <Col xs={24} lg={6}>
              <Info title="已用额度" value="24个任务" bordered />
            </Col>
            <Col xs={24} lg={6}>
              <Info title="冻结额度" value="24个任务" />
            </Col>
          </Row>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
          </div>
          <Row className={styles.importBox}>
            <Col xs={24} lg={12}>
              <strong>应付明细</strong>
            </Col>
            <Col xs={24} lg={12} style={{ textAlign: 'center', marginTop: '20px' }}>
              <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                手工录入
              </Button>
              <Link to="/instrumentagents/batch-import">
                <Button type="primary">批量导入</Button>
              </Link>
              <Button>下载模板</Button>
            </Col>
          </Row>
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}
export default CopingList;
