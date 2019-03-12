import React, { PureComponent, Fragment } from 'react';
import Error from '@/components/Error';

class ExamineSuccess extends PureComponent {
  state = {
    steptext: [
      {
        text: '您的账户已被冻结',
        key: 1,
        url: '/instrumentagents/auditing-view',
        btnName: '立即解冻',
      },
      {
        text: '您的账户已被冻结您的账户已被冻结',
        key: 2,
        url: '/instrumentagents/auditing-view',
        btnName: '立即升级',
      },
      {
        text: '您的账户已被冻结您的账户已被冻结您的账户已被冻结',
        key: 3,
        url: '/instrumentagents/auditing-view',
        btnName: '立即开通',
      },
    ],
  };

  render() {
    const { steptext } = this.state;
    return (
      <Fragment>
        <Error infoList={steptext} />
      </Fragment>
    );
  }
}

export default ExamineSuccess;
