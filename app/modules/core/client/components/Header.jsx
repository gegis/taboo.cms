import React from 'react';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Header as RsHeader, Row, Col, Grid } from 'rsuite';
import { Link, withRouter } from 'react-router-dom';
import Sidebar from 'modules/core/client/components/Sidebar';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.openSidebar = this.openSidebar.bind(this);
  }

  getLogoLinkTo() {
    const { authStore } = this.props;
    if (authStore.authenticated && authStore.user) {
      return '/dashboard';
    }
    return '/';
  }

  openSidebar() {
    const { uiStore } = this.props;
    uiStore.openUserSidebar();
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
            <Col md={8} xsHidden className="user-menu">
              {userMenu}
            </Col>
            <Col xs={18} className="sidebar-toggle-wrapper rs-visible-xs">
              <button type="button" className="rs-btn rs-btn-subtle sidebar-toggle" onClick={this.openSidebar}>
                <i className="rs-icon rs-icon-bars"></i>
              </button>
            </Col>
          </Row>
        </Grid>
        <Sidebar navigation={navigation} userMenu={userMenu} />
      </RsHeader>
    );
  }
}

Header.propTypes = {
  authStore: PropTypes.object,
  uiStore: PropTypes.object,
  navigation: PropTypes.node,
  userMenu: PropTypes.node,
};

const enhance = compose(withRouter, inject('authStore', 'uiStore'), observer);

export default enhance(Header);
