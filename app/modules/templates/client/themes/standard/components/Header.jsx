import React from 'react';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Header as RsHeader, Row, Col, Grid } from 'rsuite';
import { Link, withRouter } from 'react-router-dom';
import HeaderSubNav from 'modules/templates/client/themesAssets/components/HeaderSubNav';
import MobileSidebar from 'modules/templates/client/themesAssets/components/MobileSidebar';
import Navigation from 'modules/templates/client/themesAssets/components/Navigation';

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
    const { templatesStore } = this.props;
    let logo = null;
    if (templatesStore.settings.headerLogo) {
      logo = <img src={templatesStore.settings.headerLogo} alt="logo" />;
    }
    return logo;
  }

  getHeaderStyles() {
    const {
      templatesStore: { settings: { headerColor = '#ffffff', headerTextColor = '#7a7a7a' } = {} } = {},
    } = this.props;
    return {
      color: headerTextColor,
      backgroundColor: headerColor,
    };
  }

  render() {
    return (
      <RsHeader className="header" style={this.getHeaderStyles()}>
        <Grid>
          <Row className="menu">
            <Col xs={6} md={3} className="nav-brand-wrapper">
              <Link to={this.getLogoLinkTo()} className="nav-brand logo">
                {this.getLogo()}
              </Link>
            </Col>
            <Col md={13} smHidden className="navigation">
              <Navigation navigationName={this.getNavigationName()} style={this.getHeaderStyles()} />
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
