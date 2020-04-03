import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Link, withRouter } from 'react-router-dom';
import { autorun } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import axios from 'axios';
import { Container, Content, Grid, Row, Col, Nav, Message, Dropdown } from 'rsuite';
import { MetaTags } from 'react-meta-tags';

import Header from 'app/modules/core/client/components/Header';
import Footer from 'app/modules/core/client/components/Footer';
import NavLink from 'app/modules/core/client/components/NavLink';
import NotificationsHelper from 'app/modules/core/client/helpers/NotificationsHelper';
import ResponseHelper from 'modules/core/client/helpers/ResponseHelper';
import Translation from 'modules/core/client/components/Translation';
import ProfilePicture from 'modules/users/client/components/ProfilePicture';

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    const { localeStore, notificationsStore } = this.props;
    this.dispose = autorun(NotificationsHelper.handleNotifications.bind(this, notificationsStore, localeStore));
  }

  componentWillUnmount() {
    this.dispose();
  }

  getVerificationMessage() {
    return (
      <Message
        className="header-notification"
        type="error"
        description={
          <div>
            Please <Link to="/account-verify">verify</Link> your account.
          </div>
        }
      />
    );
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

  goToLink(link) {
    const { history } = this.props;
    return history.push(link);
  }

  goToAdmin() {
    window.location = '/admin';
  }

  getUserMenu() {
    const { authStore, userMenu } = this.props;
    const menuItems = [];
    if (userMenu) {
      return userMenu;
    } else if (authStore.authenticated && authStore.user) {
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

  getNavigation() {
    const { navigation, navigationStore } = this.props;
    if (navigation) {
      return navigation;
    } else {
      return (
        <Nav className="navigation signed-out">
          {navigationStore.navigation.map((item, i) => (
            <NavLink key={i} className="rs-nav-item-content" to={item.url}>
              {item.title}
            </NavLink>
          ))}
        </Nav>
      );
    }
  }

  getUserNavigation() {
    const { authStore, userNavigation, navigationStore } = this.props;
    if (userNavigation) {
      return userNavigation;
    } else if (authStore.authenticated && authStore.user) {
      return (
        <Nav className="navigation signed-in">
          {navigationStore.userNavigation.map((item, i) => (
            <NavLink key={i} className="rs-nav-item-content" to={item.url}>
              {item.title}
            </NavLink>
          ))}
        </Nav>
      );
    } else {
      return null;
    }
  }

  getHeaderNavigation() {
    const { authStore } = this.props;
    if (authStore.authenticated && authStore.user) {
      return this.getUserNavigation();
    } else {
      return this.getNavigation();
    }
  }

  getMetaTitle() {
    const { config: { metaTitle: defaultMetaTitle = '' } = {} } = window.app;
    const { metaTitle } = this.props;
    if (!metaTitle) {
      return defaultMetaTitle;
    } else {
      return `${metaTitle} | ${defaultMetaTitle}`;
    }
  }

  render() {
    const { children, uiStore, authStore, className } = this.props;
    return (
      <Container className={classNames('default-layout', className)}>
        <MetaTags>
          <title>{this.getMetaTitle()}</title>
        </MetaTags>
        <Header navigation={this.getHeaderNavigation()} userMenu={this.getUserMenu()} />
        {uiStore.loading && <div className="loader" />}
        {authStore.user.id && !authStore.verified && this.getVerificationMessage()}
        <Content className="main-content">
          <Grid>
            <Row>
              <Col md={24}>{children}</Col>
            </Row>
          </Grid>
        </Content>
        <Footer navigation={this.getNavigation()} userMenu={this.getUserMenu()} />
        <textarea
          className="helper-copy-value-input"
          ref={el => {
            window.copyValueInput = el;
          }}
        />
      </Container>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  userMenu: PropTypes.node,
  navigation: PropTypes.node,
  userNavigation: PropTypes.node,
  className: PropTypes.string,
  metaTitle: PropTypes.string,
  uiStore: PropTypes.object,
  notificationsStore: PropTypes.object,
  localeStore: PropTypes.object,
  authStore: PropTypes.object,
  navigationStore: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
};

const enhance = compose(
  withRouter,
  inject('uiStore', 'authStore', 'notificationsStore', 'localeStore', 'navigationStore'),
  observer
);

export default enhance(Layout);
