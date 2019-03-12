import React, { PureComponent, Fragment } from 'react';
import { Button, Steps, Card, Popover } from 'antd';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import Result from '@/components/Result';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

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
class Success extends PureComponent {
  state = {
    stepDirection: 'horizontal',
  };

  // 钩子函数
  componentDidMount() {
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
    const { stepDirection } = this.state;
    const { title, steptitle, steptext, active } = this.props;
    console.log(steptext);
    const extra = (
      <Fragment>
        <div
          style={{
            fontSize: 16,
            color: 'rgba(0, 0, 0, 0.85)',
            fontWeight: '500',
            marginBottom: 20,
          }}
        >
          {steptitle}
        </div>
        {/* <Card bordered={false}> */}
        <Steps
          direction={stepDirection}
          progressDot={customDot}
          style={{ width: 'calc(100% + 84px)' }}
          current={active}
        >
          {steptext.map(item => {
            return (
              <Step key={item.key} title={<span style={{ fontSize: 14 }}>{item.text}</span>} />
            );
          })}
        </Steps>
        {/* </Card> */}
      </Fragment>
    );

    const actions = (
      <Fragment>
        <Button type="primary">返回列表</Button>
        <Button>查看记录</Button>
      </Fragment>
    );
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Result
            type="success"
            title={title}
            // description={formatMessage({ id: 'app.result.success.description' })}
            extra={extra}
            actions={actions}
            style={{ marginTop: 48, marginBottom: 16 }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Success;
