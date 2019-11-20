import React from 'react';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Header as RsHeader, Nav, Icon, Dropdown, Row, Col, Grid, Button, Drawer } from 'rsuite';
import ResponseHelper from 'app/modules/core/client/helpers/ResponseHelper';
import Translation from 'app/modules/core/client/components/Translation';
import { Link, withRouter } from 'react-router-dom';
import NavLink from 'app/modules/core/client/components/NavLink';
import ButtonLink from 'app/modules/core/client/components/ButtonLink';
import ProfilePicture from 'app/modules/users/client/components/ProfilePicture';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
    this.state = {
      showMenu: false,
      showMobileSearch: false,
    };
    this.onCloseMenu = this.onCloseMenu.bind(this);
    this.onOpenMenu = this.onOpenMenu.bind(this);
    this.toggleMobileSearch = this.toggleMobileSearch.bind(this);
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

  getTopMenu() {
    const { authStore, publicNav, topMenuSearch } = this.props;
    if (authStore.authenticated && authStore.user) {
      return (
        <Nav className="top-menu">
          <NavLink className="rs-nav-item-content" to="/activity">
            Activity
          </NavLink>
          <NavLink className="rs-nav-item-content" to="/transfer">
            Transfer
          </NavLink>
          {topMenuSearch}
        </Nav>
      );
    } else {
      return publicNav;
    }
  }

  goToLink(link) {
    const { history } = this.props;
    return history.push(link);
  }

  goToAdmin() {
    window.location = '/admin';
  }

  getTopRightMenu() {
    const { authStore, topRightMenu } = this.props;
    const userMenu = [];
    if (topRightMenu) {
      return topRightMenu;
    } else if (authStore.authenticated && authStore.user) {
      userMenu.push(
        <Dropdown.Item key="my-profile" onSelect={this.goToLink.bind(this, '/my-profile')}>
          <Translation message="My Profile" />
        </Dropdown.Item>
      );
      userMenu.push(<Dropdown.Item key="divider-verification" divider />);
      userMenu.push(
        <Dropdown.Item key="user-verification" onSelect={this.goToLink.bind(this, '/account-verify')}>
          <Translation message="Account Verification" />
        </Dropdown.Item>
      );
      if (authStore.user.admin) {
        userMenu.push(<Dropdown.Item key="divider-admin" divider />);
        userMenu.push(
          <Dropdown.Item key="admin" onSelect={this.goToAdmin}>
            <Translation message="Admin" />
          </Dropdown.Item>
        );
      }
      userMenu.push(<Dropdown.Item key="divider-logout" divider />);
      userMenu.push(
        <Dropdown.Item key="logout" onSelect={this.handleLogout}>
          <Translation message="Logout" />
        </Dropdown.Item>
      );

      return (
        <Nav className="user-menu" pullRight>
          <Dropdown
            icon={<ProfilePicture url={authStore.user.profilePictureUrl} size="xs" />}
            title={<span className="rs-hidden-xs">{authStore.user.email}</span>}
            placement="bottomEnd"
          >
            {userMenu}
          </Dropdown>
        </Nav>
      );
    } else {
      return (
        <Nav className="top-right-links" pullRight>
          <NavLink className="rs-nav-item-content" to="/sign-in">
            Sign In
          </NavLink>
        </Nav>
      );
    }
  }

  getLogoLink() {
    const { authStore } = this.props;
    if (authStore.authenticated && authStore.user) {
      return '/dashboard';
    }
    return '/';
  }

  onOpenMenu() {
    this.setState({
      showMenu: true,
    });
  }

  onCloseMenu() {
    this.setState({
      showMenu: false,
    });
  }

  getMobileMenu() {
    const { showMenu } = this.state;
    const { authStore, publicNav } = this.props;
    return (
      <Drawer
        placement="left"
        size="xs"
        show={showMenu}
        onHide={this.onCloseMenu}
        backdrop={true}
        className="user-menu-drawer"
      >
        <Drawer.Header />
        <Drawer.Body>
          {authStore.authenticated && authStore.user && (
            <div>
              <div className="v-spacer-5" />
              <div className="user-menu-profile">
                <ProfilePicture url={authStore.user.profilePictureUrl} size="xs" />
                {authStore.user.firstName} {authStore.user.lastName}
              </div>
              <div className="v-spacer-5" />
              <Nav className="mobile-menu" vertical>
                <NavLink to="/activity">Activity</NavLink>
                <NavLink to="/transfer">Transfer</NavLink>
              </Nav>
              <div className="divider divider-10" />
              <div className="v-spacer-4" />
              <Nav className="mobile-menu" vertical>
                <NavLink className="" to="/my-profile">
                  <Translation message="My Profile" />
                </NavLink>
                <NavLink className="" to="/account-verify">
                  <Translation message="Account Verification" />
                </NavLink>
                {authStore.user && authStore.user.admin && (
                  <Nav.Item className="" onClick={this.goToAdmin}>
                    Admin
                  </Nav.Item>
                )}
              </Nav>
              <div className="v-spacer-4" />
              <Button key="logout" appearance="primary" onClick={this.handleLogout}>
                <Translation message="Logout" />
              </Button>
            </div>
          )}
          {!authStore.authenticated && (
            <div>
              <div className="v-spacer-5" />
              <div className="v-spacer-5" />
              {publicNav}
            </div>
          )}
          {!authStore.authenticated && (
            <div>
              <div className="v-spacer-5" />
              <ButtonLink appearance="primary" to="/sign-in">
                Sign In
              </ButtonLink>
              <div className="v-spacer-3" />
              <Link to="/sign-up">Sign up</Link>
            </div>
          )}
        </Drawer.Body>
      </Drawer>
    );
  }

  toggleMobileSearch() {
    this.setState({ showMobileSearch: !this.state.showMobileSearch });
  }

  getMobileHeader() {
    const { showMobileSearch } = this.state;
    const { topMenuSearch } = this.props;
    return (
      <div className="mobile-header rs-visible-xs rs-visible-sm">
        <Row>
          <Col xs={4} className="menu-toggle-wrapper">
            <Button onClick={this.onOpenMenu} className="menu-toggle" appearance="subtle">
              <Icon icon="bars" />
            </Button>
          </Col>
          <Col xs={16} className="nav-brand-wrapper">
            <Link to={this.getLogoLink()} className="nav-brand logo">
              <img src="/images/logo.png" alt="logo" />
            </Link>
          </Col>
          <Col xs={4} className="menu-search-toggle-wrapper">
            {topMenuSearch && (
              <Button appearance="subtle" className="search-toggle">
                <Icon onClick={this.toggleMobileSearch} icon="search" />
              </Button>
            )}
          </Col>
          {topMenuSearch && showMobileSearch && <Col xs={24}>{topMenuSearch}</Col>}
        </Row>
        <div className="mobile-menu-wrapper">{this.getMobileMenu()}</div>
      </div>
    );
  }

  render() {
    return (
      <RsHeader className="header">
        <Grid>
          <Row className="rs-hidden-xs rs-hidden-sm">
            <Col md={6} className="nav-brand-wrapper">
              <Link to={this.getLogoLink()} className="nav-brand logo">
                <img src="/images/logo.png" alt="logo" />
              </Link>
            </Col>
            <Col md={12}>{this.getTopMenu()}</Col>
            <Col md={6}>{this.getTopRightMenu()}</Col>
          </Row>
          {this.getMobileHeader()}
        </Grid>
      </RsHeader>
    );
  }
}

Header.propTypes = {
  authStore: PropTypes.object,
  publicNav: PropTypes.node,
  history: PropTypes.object,
  topRightMenu: PropTypes.node,
  topMenuSearch: PropTypes.node,
};

const enhance = compose(
  withRouter,
  inject('authStore'),
  observer
);

export default enhance(Header);
