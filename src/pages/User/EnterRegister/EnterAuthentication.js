import React, { Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
// import { routerRedux } from 'dva/router';
import { Form, Input, Button, Select, Row, Radio, DatePicker, Upload, Icon, message } from 'antd';
import styles from './index.less';

const dateFormat = 'YYYY/MM/DD';
const FormItem = Form.Item;
const { Option } = Select;

@connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
class Account extends React.PureComponent {
  state = {
    loading: false,
  };

  componentDidUpdate() {
    const { form, register } = this.props;
    const account = form.getFieldValue('mail');
    if (register.status === 'ok') {
      router.push({
        pathname: '/user/register-result',
        state: {
          account,
        },
      });
    }
  }

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  beforeUpload = file => {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
  };

  handleChange = info => {
    console.log(info);
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, (err, fieldsValue) => {
      if (!err) {
        const values = {
          ...fieldsValue,
          data: fieldsValue.data ? fieldsValue.data.format('YYYY-MM-DD') : undefined,
        };
        console.log(values, dispatch);
        // dispatch(routerRedux.push('/user/enter-register/enter-binding'));
        // const { prefix } = this.state;
        // dispatch({
        //   type: 'register/submit',
        //   payload: {
        //     ...values,
        //     prefix,
        //   },
        // });
      }
    });
  };

  render() {
    const {
      submitting,
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xl: { span: 9 },
        lg: { span: 6 },
        md: { span: 3 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xl: { span: 8 },
        lg: { span: 12 },
        md: { span: 20 },
        sm: { span: 20 },
      },
    };
    const { imageUrl, loading } = this.state;
    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <Fragment>
        <Form onSubmit={this.handleSubmit} layout="horizontal" {...formItemLayout}>
          <Row style={{ paddingLeft: 24, paddingRight: 24 }}>
            <FormItem label="企业信息填写" className={styles.title}>
              请准确填写企业信息，认证通过后不可修改
            </FormItem>
            <FormItem label="企业名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入企业名称！',
                  },
                ],
              })(<Input placeholder="请输入企业名称" />)}
            </FormItem>
            <FormItem label="企业类型">
              {getFieldDecorator('enterType', {
                rules: [
                  {
                    required: true,
                    message: '请选择企业类型！',
                  },
                ],
              })(
                <Select placeholder="请选择企业类型">
                  <Option value="1">国有企业</Option>
                  <Option value="2">私有企业</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="是否上市">
              <div>
                {getFieldDecorator('public', {
                  rules: [
                    {
                      required: true,
                      message: '请选择是否上市！',
                    },
                  ],
                })(
                  <Radio.Group>
                    <Radio value="1">是</Radio>
                    <Radio value="2">否</Radio>
                  </Radio.Group>
                )}
                {getFieldValue('public') === '1' ? (
                  <FormItem>
                    {getFieldDecorator('exchange', {
                      rules: [
                        {
                          required: true,
                          message: '请选择交易所！',
                        },
                      ],
                    })(
                      <Select placeholder="请选择交易所">
                        <Option value="1">1</Option>
                        <Option value="2">2</Option>
                        <Option value="3">3</Option>
                      </Select>
                    )}
                  </FormItem>
                ) : null}
                {getFieldValue('public') === '1' ? (
                  <FormItem style={{ marginBottom: 0 }}>
                    {getFieldDecorator('shares', {
                      rules: [
                        {
                          required: true,
                          message: '请输入股票代码！',
                        },
                      ],
                    })(<Input placeholder="请输入股票代码" />)}
                  </FormItem>
                ) : null}
              </div>
            </FormItem>
            <FormItem label="统一社会信用代码">
              {getFieldDecorator('mail', {
                rules: [
                  {
                    required: true,
                    message: '请输入统一社会信用代码！',
                  },
                ],
              })(<Input placeholder="请输入统一社会信用代码" />)}
            </FormItem>
            <FormItem label="成立时间">
              {getFieldDecorator('data', {
                rules: [
                  {
                    required: true,
                    message: '请选择成立时间！',
                  },
                ],
              })(
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="请选择成立时间"
                  format={dateFormat}
                />
              )}
            </FormItem>
            <FormItem label="公司地址">
              {getFieldDecorator('sili', {
                rules: [
                  {
                    required: true,
                    message: '请输入公司地址！',
                  },
                ],
              })(<Input placeholder="请输入公司地址" />)}
            </FormItem>
            <FormItem label="企业邮箱">
              {getFieldDecorator('mail', {
                rules: [
                  {
                    type: 'email',
                    message: '请输入企业邮箱！',
                  },
                ],
              })(<Input placeholder="请输入企业邮箱" />)}
            </FormItem>
            <FormItem label="企业邮箱">
              {getFieldDecorator('img', {
                rules: [
                  {
                    required: true,
                    message: '请输入企业邮箱！',
                  },
                ],
              })(
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className={styles.uploader}
                  showUploadList={false}
                  action="//jsonplaceholder.typicode.com/posts/"
                  beforeUpload={this.beforeUpload}
                  onChange={this.handleChange}
                >
                  {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                </Upload>
              )}
            </FormItem>
            <FormItem label=" " className={styles.Nafter}>
              <Button
                size="large"
                loading={submitting}
                className={styles.submit}
                type="primary"
                htmlType="submit"
              >
                提交
              </Button>
            </FormItem>
          </Row>
        </Form>
      </Fragment>
    );
  }
}

export default Account;
