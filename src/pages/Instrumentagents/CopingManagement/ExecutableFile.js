import React, { Component } from 'react';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { Button, Card, Steps, Form, Col, Popover, Row, Icon, Table } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import 'antd/dist/antd.css';
import styles from './ExecutableFile.less';

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
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class ExecutableFile extends Component {
  index = 0;

  cacheOriginData = {};

  // 上传
  state = {
    stepDirection: 'horizontal',
    formValues: {},
    visible: false,
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
    const specialLayout = {
      wrapperCol: {
        xl: { span: 24 },
        sm: { span: 24 },
      },
    };
    const columns = [
      {
        title: '凭证编号',
        dataIndex: 'key',
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
        render: val => `${val} 元`,
        align: 'center',
      },
      {
        title: '凭证日期',
        dataIndex: 'updatedAt',
        align: 'center',
      },
      {
        title: '付款日期',
        dataIndex: 'createdAt',
        align: 'center',
      },
      {
        title: '应付金额',
        dataIndex: 'callNo',
        render: val => `${val} 元`,
        align: 'center',
      },
      {
        title: '备注',
        dataIndex: 'desc',
        align: 'center',
      },
      {
        title: '错误原因',
        dataIndex: 'status',
        align: 'center',
      },
    ];
    const { stepDirection } = this.state;

    // const { title } = this.props;
    return (
      <PageHeaderWrapper>
        <Card title="执行文件" style={{ marginBottom: 24 }} bordered={false}>
          <Steps direction={stepDirection} progressDot={customDot} current={1}>
            <Step title="上传文件" />
            <Step title="执行文件" />
            <Step title="导入完成" />
          </Steps>
          <Row className={styles.quantity}>
            <Card bordered>
              <div style={{ marginRight: 8, float: 'left' }}>
                <Icon
                  style={{ color: '#52c41a', marginRight: 8, fontSize: 72 }}
                  type="check-circle"
                  theme="filled"
                />
              </div>
              <div style={{ float: 'left' }}>
                <h2>本次可导入数量</h2>
                <span>30条</span>
              </div>
            </Card>
            <Card bordered>
              <div style={{ marginRight: 8, float: 'left' }}>
                <Icon
                  style={{ color: '#f5222d', marginRight: 8, fontSize: 72 }}
                  type="close-circle"
                  theme="filled"
                />
              </div>
              <div style={{ float: 'left' }}>
                <h2>本次不可导入数量</h2>
                <span>30条</span>
              </div>
            </Card>
          </Row>
          <Row>
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
          </Row>
          <Row>
            <Col xl={24} lg={24} md={24} sm={24} className={styles.TextCenter}>
              <Form.Item {...specialLayout}>
                <Button htmlType="submit" size="large">
                  取消
                </Button>
                <Button style={{ marginLeft: 20 }} type="primary" htmlType="submit" size="large">
                  下一步
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ExecutableFile;
