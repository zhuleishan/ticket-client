import React, { Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import { routerRedux } from 'dva/router';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Button, Select, Row, Col, Popover, Progress } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="validation.password.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="validation.password.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="validation.password.strength.short" />
    </div>
  ),
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
class Account extends React.PureComponent {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    prefix: '86',
    codeState: true,
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

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {
    let count = 59;
    this.setState({ count, codeState: true });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
        this.setState({ codeState: false });
      }
    }, 1000);
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, err => {
      if (!err) {
        dispatch(routerRedux.push('/user/enter-register/enter-binding'));
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

  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(formatMessage({ id: 'validation.password.twice' }));
    } else {
      callback();
    }
  };

  mobile = (rule, value, callback) => {
    const mobileTest = /^\d{11}$/;
    if (!value) {
      callback(formatMessage({ id: 'validation.phone-number.required' }));
    } else if (!mobileTest.test(value)) {
      callback(formatMessage({ id: 'validation.phone-number.wrong-format' }));
    } else {
      this.setState({
        codeState: false,
      });
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        help: formatMessage({ id: 'validation.password.required' }),
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  changePrefix = value => {
    this.setState({
      prefix: value,
    });
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count, prefix, help, visible, codeState } = this.state;
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
                    message: formatMessage({ id: 'validation.name.required' }),
                  },
                ],
              })(<Input size="large" placeholder="请输入企业名称" />)}
            </FormItem>
            <FormItem label="企业邮箱">
              {getFieldDecorator('mail', {
                rules: [
                  {
                    type: 'email',
                    message: formatMessage({ id: 'validation.email.wrong-format' }),
                  },
                ],
              })(<Input size="large" placeholder="请输入企业邮箱" />)}
            </FormItem>
            <FormItem help={help} label="企业名称">
              <Popover
                getPopupContainer={node => node.parentNode}
                content={
                  <div style={{ padding: '4px 0' }}>
                    {passwordStatusMap[this.getPasswordStatus()]}
                    {this.renderPasswordProgress()}
                    <div style={{ marginTop: 10 }}>
                      <FormattedMessage id="validation.password.strength.msg" />
                    </div>
                  </div>
                }
                overlayStyle={{ width: 240 }}
                placement="right"
                visible={visible}
              >
                {getFieldDecorator('password', {
                  rules: [
                    {
                      validator: this.checkPassword,
                    },
                  ],
                })(
                  <Input
                    size="large"
                    type="password"
                    placeholder={formatMessage({ id: 'form.password.placeholder' })}
                  />
                )}
              </Popover>
            </FormItem>
            <FormItem label="企业名称">
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.confirm-password.required' }),
                  },
                  {
                    validator: this.checkConfirm,
                  },
                ],
              })(
                <Input
                  size="large"
                  type="password"
                  placeholder={formatMessage({ id: 'form.confirm-password.placeholder' })}
                />
              )}
            </FormItem>
            <FormItem label="企业名称">
              <InputGroup compact>
                <Select
                  size="large"
                  value={prefix}
                  onChange={this.changePrefix}
                  style={{ width: '20%' }}
                >
                  <Option value="86">+86</Option>
                  <Option value="87">+87</Option>
                </Select>
                {getFieldDecorator('mobile', {
                  rules: [
                    {
                      validator: this.mobile,
                    },
                  ],
                })(
                  <Input
                    size="large"
                    style={{ width: '80%' }}
                    placeholder={formatMessage({ id: 'form.phone-number.placeholder' })}
                  />
                )}
              </InputGroup>
            </FormItem>
            <FormItem label="企业名称">
              <Row gutter={8}>
                <Col span={16}>
                  {getFieldDecorator('captcha', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'validation.verification-code.required' }),
                      },
                    ],
                  })(
                    <Input
                      size="large"
                      placeholder={formatMessage({ id: 'form.verification-code.placeholder' })}
                    />
                  )}
                </Col>
                <Col span={8}>
                  <Button
                    size="large"
                    disabled={codeState}
                    className={styles.getCaptcha}
                    onClick={this.onGetCaptcha}
                  >
                    {count
                      ? `${count} s`
                      : formatMessage({ id: 'app.register.get-verification-code' })}
                  </Button>
                </Col>
              </Row>
            </FormItem>
            <FormItem label=" " className={styles.Nafter}>
              <Button
                size="large"
                loading={submitting}
                className={styles.submit}
                type="primary"
                htmlType="submit"
              >
                <FormattedMessage id="app.register.register" />
              </Button>
              <Link className={styles.login} to="/User/Login">
                <FormattedMessage id="app.register.sign-in" />
              </Link>
            </FormItem>
          </Row>
        </Form>
      </Fragment>
    );
  }
}

export default Account;
