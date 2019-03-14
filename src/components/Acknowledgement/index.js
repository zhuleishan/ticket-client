import React, { Component } from 'react';
import { Col, Row } from 'antd';
import styles from './index.less';

const log = 'http://www.cnqc.com/img/logo.png';
const logs = 'http://www.guotsing.com/images/logo3.png';
const Qrcoder =
  'https://gss0.bdstatic.com/94o3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike80%2C5%2C5%2C80%2C26/sign=fa9140accd95d143ce7bec711299e967/2934349b033b5bb571dc8c5133d3d539b600bc12.jpg';
// eslint-disable-next-line react/prefer-stateless-function
export default class ActiveChart extends Component {
  render() {
    return (
      <Row className={styles.billCase}>
        <Row>
          <Col xl={8} lg={8} md={8} sm={8}>
            {<img alt="" src={log} />}
          </Col>
          <Col xl={8} lg={8} md={8} sm={8} className={styles.BillName}>
            <Col className={styles.BNameborder}>
              <Col className={styles.BName}>付款承诺函</Col>
            </Col>
            <img alt="" src={logs} className={styles.logins} />
          </Col>
          <Col xl={8} lg={8} md={8} sm={8} style={{ textAlign: 'right' }}>
            <img alt="" src={Qrcoder} className={styles.Qrcoder} />
            <Col className={styles.Qrsizi}>资产通行码</Col>
          </Col>
        </Row>
        <Row>
          <Col xl={8} lg={8} md={8} sm={8}>
            No. 2309023232
          </Col>
          <Col xl={8} lg={8} md={8} sm={8}>
            开立日期：2019-08-09
          </Col>
          <Col xl={8} lg={8} md={8} sm={8}>
            凭证状态：已签收
          </Col>
        </Row>
        <table />
      </Row>
    );
  }
}
