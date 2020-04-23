import React from 'react';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Header as RsHeader, Row, Col, Grid } from 'rsuite';
import { Link, withRouter } from 'react-router-dom';
import HeaderSubNav from 'app/themes/_shared/ui/components/HeaderSubNav';
import MobileSidebar from 'app/themes/_shared/ui/components/MobileSidebar';
import Navigation from 'app/themes/_shared/ui/components/Navigation';

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

  getNavigationName() {
    const { authStore, templatesStore } = this.props;
    if (authStore.authenticated && authStore.user) {
      return templatesStore.languageSettings.headerNavigationAuthenticated;
    }
    return templatesStore.languageSettings.headerNavigation;
  }

  getLogo() {
    const { templatesStore: { settings: { headerLogo = null } = {} } = {} } = this.props;
    let logo = null;
    if (headerLogo) {
      logo = <img src={headerLogo} alt="logo" />;
    }
    return logo;
  }

  render() {
    return (
      <RsHeader className="header">
        <Grid>
          <Row className="menu">
            <Col xs={6} md={3} className="nav-brand-wrapper">
              <Link to={this.getLogoLinkTo()} className="nav-brand logo">
                {this.getLogo()}
              </Link>
            </Col>
            <Col md={13} smHidden className="navigation">
              <Navigation navigationName={this.getNavigationName()} />
            </Col>
            <Col md={8} smHidden className="user-menu">
              <HeaderSubNav />
            </Col>
            <Col xs={18} className="sidebar-toggle-wrapper rs-visible-sm">
              <button type="button" className="rs-btn rs-btn-subtle sidebar-toggle" onClick={this.openSidebar}>
                <i className="rs-icon rs-icon-bars" />
              </button>
            </Col>
          </Row>
        </Grid>
        <MobileSidebar />
      </RsHeader>
    );
  }
}

Header.propTypes = {
  authStore: PropTypes.object,
  uiStore: PropTypes.object,
  templatesStore: PropTypes.object,
  navigationStore: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
};

const enhance = compose(withRouter, inject('authStore', 'uiStore', 'templatesStore', 'navigationStore'), observer);

export default enhance(Header);
