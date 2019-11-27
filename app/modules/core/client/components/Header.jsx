import React from 'react';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Header as RsHeader, Row, Col, Grid } from 'rsuite';
import { Link, withRouter } from 'react-router-dom';

class Header extends React.Component {
  getLogoLinkTo() {
    const { authStore } = this.props;
    if (authStore.authenticated && authStore.user) {
      return '/dashboard';
    }
    return '/';
  }

  render() {
    const { navigation, userMenu } = this.props;
    return (
      <RsHeader className="header">
        <Grid>
          <Row className="menu">
            <Col xs={6} md={3} className="nav-brand-wrapper">
              <Link to={this.getLogoLinkTo()} className="nav-brand logo">
                <img src="/images/logo.png" alt="logo" />
              </Link>
            </Col>
            <Col md={13} xsHidden className="navigation">
              {navigation}
            </Col>
            <Col xs={18} md={8} className="user-menu">
              {userMenu}
            </Col>
          </Row>
        </Grid>
      </RsHeader>
    );
  }
}

Header.propTypes = {
  authStore: PropTypes.object,
  navigation: PropTypes.node,
  userMenu: PropTypes.node,
};

const enhance = compose(withRouter, inject('authStore'), observer);

export default enhance(Header);
