import React from 'react';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Header as RsHeader, Row, Col, Grid, Nav, Dropdown } from 'rsuite';
import { Link, withRouter } from 'react-router-dom';
import Sidebar from './Sidebar';
import NavLink from 'app/modules/core/client/components/NavLink';
import Translation from 'modules/core/client/components/Translation';
import ProfilePicture from 'modules/users/client/components/ProfilePicture';
import ResponseHelper from 'modules/core/client/helpers/ResponseHelper';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.openSidebar = this.openSidebar.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  getLogoLinkTo() {
    const { authStore } = this.props;
    if (authStore.authenticated && authStore.user) {
      return '/dashboard';
    }
    return '/';
  }

  goToLink(link) {
    const { history } = this.props;
    return history.push(link);
  }

  goToAdmin() {
    window.location = '/admin';
  }

  handleLogout() {
    const { authStore, history } = this.props;
    axios
      .get('/api/logout')
      .then(response => {
        if (response && response.data && response.data.success) {
          authStore.loadUserAuth().then(() => {
            return history.push('/');
          });
        } else {
          throw new Error('Error logging out');
        }
      })
      .catch(ResponseHelper.handleError);
  }

  openSidebar() {
    const { uiStore } = this.props;
    uiStore.openUserSidebar();
  }

  getUserDropdown() {
    const { authStore } = this.props;
    const menuItems = [];
    if (authStore.authenticated && authStore.user) {
      // TODO move this into separate component
      menuItems.push(
        <Dropdown.Item key="my-profile" onSelect={this.goToLink.bind(this, '/my-profile')}>
          <Translation message="My Profile" />
        </Dropdown.Item>
      );
      menuItems.push(<Dropdown.Item key="divider-verification" divider />);
      menuItems.push(
        <Dropdown.Item key="user-verification" onSelect={this.goToLink.bind(this, '/account-verify')}>
          <Translation message="Account Verification" />
        </Dropdown.Item>
      );
      if (authStore.user.admin) {
        menuItems.push(<Dropdown.Item key="divider-admin" divider />);
        menuItems.push(
          <Dropdown.Item key="admin" onSelect={this.goToAdmin}>
            <Translation message="Admin" />
          </Dropdown.Item>
        );
      }
      menuItems.push(<Dropdown.Item key="divider-logout" divider />);
      menuItems.push(
        <Dropdown.Item key="logout" onSelect={this.handleLogout}>
          <Translation message="Logout" />
        </Dropdown.Item>
      );

      return (
        <Nav className="user-menu signed-in" pullRight>
          <Dropdown
            icon={<ProfilePicture url={authStore.user.profilePictureUrl} size="xs" />}
            title={<span className="rs-hidden-xs">{authStore.user.email}</span>}
            placement="bottomEnd"
          >
            {menuItems}
          </Dropdown>
        </Nav>
      );
    } else {
      return (
        <Nav className="user-menu signed-out" pullRight>
          <NavLink className="rs-nav-item-content" to="/sign-in">
            Sign In
          </NavLink>
          <NavLink className="rs-nav-item-content" to="/sign-up">
            Sign Up
          </NavLink>
        </Nav>
      );
    }
  }

  getNavigationName() {
    const { authStore, templatesStore } = this.props;
    if (authStore.authenticated && authStore.user) {
      return templatesStore.languageSettings.headerNavigationAuthenticated;
    }
    return templatesStore.languageSettings.headerNavigation;
  }

  getNavigation() {
    const { navigation } = this.props.navigationStore;
    const navigationName = this.getNavigationName();
    return (
      <Nav className="navigation signed-out">
        {/*TODO implement hierarchical menu output*/}
        {navigation[navigationName] &&
          navigation[navigationName].map((item, i) => (
            <NavLink key={i} className="rs-nav-item-content" to={item.url}>
              {item.title}
            </NavLink>
          ))}
      </Nav>
    );
  }

  render() {
    return (
      <RsHeader className="header">
        <Grid>
          <Row className="menu">
            <Col xs={6} md={3} className="nav-brand-wrapper">
              <Link to={this.getLogoLinkTo()} className="nav-brand logo">
                {/*TODO read image from settings*/}
                <img src="/images/logo.png" alt="logo" />
              </Link>
            </Col>
            <Col md={13} xsHidden className="navigation">
              {this.getNavigation()}
            </Col>
            <Col md={8} xsHidden className="user-menu">
              {this.getUserDropdown()}
            </Col>
            <Col xs={18} className="sidebar-toggle-wrapper rs-visible-xs">
              <button type="button" className="rs-btn rs-btn-subtle sidebar-toggle" onClick={this.openSidebar}>
                <i className="rs-icon rs-icon-bars"></i>
              </button>
            </Col>
          </Row>
        </Grid>
        <Sidebar />
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
