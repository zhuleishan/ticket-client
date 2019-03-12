import React, { PureComponent, Fragment } from 'react';
import Success from '@/components/Success';

class ExamineSuccess extends PureComponent {
  state = {
    active: 1,
    steptext: [{ text: '1', key: 1 }, { text: '2', key: 2 }, { text: '3', key: 3 }],
  };

  render() {
    const { active, steptext } = this.state;
    return (
      <Fragment>
        <Success
          title="凭证已创建成功！"
          steptitle="开具流程"
          steptext={steptext}
          active={active}
        />
      </Fragment>
    );
  }
}

export default ExamineSuccess;
