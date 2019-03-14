import React, { Component } from 'react';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import {
  Button,
  Card,
  Steps,
  Form,
  // Row,
  Col,
  Popover,
  Row,
  message,
  Upload,
  // Icon
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import 'antd/dist/antd.css';
import styles from './BatchImport.less';

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
@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class BatchImport extends Component {
  index = 0;

  cacheOriginData = {};

  // 上传
  state = {
    stepDirection: 'horizontal',
    fileList: [],
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

  render() {
    const { fileList } = this.state;
    const props = {
      name: 'file',
      action: 'rule/fetch',
      multiple: false,
      onChange(info) {
        if (info.file.status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
      },
      fileList,
    };
    const specialLayout = {
      wrapperCol: {
        xl: { span: 24 },
        sm: { span: 24 },
      },
    };
    const { stepDirection } = this.state;

    // const { title } = this.props;
    return (
      <PageHeaderWrapper>
        <Card title="批量导入" style={{ marginBottom: 24 }} bordered={false}>
          <Steps direction={stepDirection} progressDot={customDot} current={0}>
            <Step title="上传文件" />
            <Step title="执行文件" />
            <Step title="导入完成" />
          </Steps>
          <Row className={styles.uploadBox}>
            <Col span={24}>
              <div className={styles.imgTb}>
                <img
                  src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png"
                  alt=""
                />
              </div>
              <div>
                <h3>上传填写好的资产数据</h3>
                <p>请按照数据模板的格式导入数据，模板中的表头不可更改，表头行不能删除</p>
                <div>
                  <Button style={{ marginRIght: 20 }}>下载模板</Button>
                  <Upload {...props} className={styles.upload}>
                    <Button>文件上传</Button>
                  </Upload>
                </div>
              </div>
            </Col>
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

export default BatchImport;
