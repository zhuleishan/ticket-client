import React, { PureComponent, Fragment } from 'react';
import { Icon, Tooltip } from 'antd';

class ToolitpTitle extends PureComponent {
  render() {
    const { text, title } = this.props;
    return (
      <Fragment>
        <span style={{ marginRight: 8 }}>{text}</span>
        <Tooltip placement="top" title={title}>
          <Icon type="question-circle" theme="outlined" />
        </Tooltip>
      </Fragment>
    );
  }
}
export default ToolitpTitle;
