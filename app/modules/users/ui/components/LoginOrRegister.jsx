import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Panel, Row, Col } from 'rsuite';
import PropTypes from 'prop-types';

class LoginOrRegister extends Component {
  render() {
    const { header = null, bodyText = null } = this.props;
    return (
      <Panel header={header} className="login-or-register">
        {bodyText && (
          <Row>
            <Col>
              <div className="body-text">{bodyText}</div>
            </Col>
          </Row>
        )}
        <Row>
          <Col xs={12}>
            <Link className="rs-btn rs-btn-primary" to="/sign-in">
              Login
            </Link>
          </Col>
          <Col xs={12}>
            <Link className="rs-btn rs-btn-primary" to="/sign-up">
              Register
            </Link>
          </Col>
        </Row>
      </Panel>
    );
  }
}

LoginOrRegister.propTypes = {
  header: PropTypes.string,
  bodyText: PropTypes.string,
};

export default LoginOrRegister;
