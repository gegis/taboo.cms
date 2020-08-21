import React from 'react';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import { Nav, Dropdown, Icon } from 'rsuite';
import axios from 'axios';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import ProfilePicture from 'modules/users/ui/components/ProfilePicture';
import ResponseHelper from 'modules/core/ui/helpers/ResponseHelper';
import DropdownLink from 'modules/core/ui/components/DropdownLink';
import LogoutButton from 'modules/core/ui/components/LogoutButton';

const { usersSignInEnabled } = window.app.config;

class HeaderSubNav extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    const { authStore, history, notificationsStore } = this.props;
    axios
      .get('/api/logout')
      .then(response => {
        if (response && response.data && response.data.success) {
          notificationsStore.push({
            title: 'Information',
            html: 'You have successfully logged out',
            translate: true,
          });
          authStore.loadUserAuth().then(() => {
            return history.push('/');
          });
        } else {
          throw new Error('Error logging out');
        }
      })
      .catch(ResponseHelper.handleError);
  }

  goToAdmin() {
    window.location = '/admin';
  }

  getAuthenticatedMenu() {
    const { authStore } = this.props;
    // return [
    // <Link key="home" to="/dashboard" className="home-btn">
    //   {' '}
    // </Link>,
    // ];
    return (
      <Nav key="user-menu" className="user-menu signed-in" pullRight={true}>
        <Dropdown
          icon={<ProfilePicture url={authStore.user.profilePictureUrl} size="xs" alternative={true} />}
          title={
            <span className="user-email" title={authStore.user.email}>
              {authStore.user.email}
            </span>
          }
          placement="bottomEnd"
        >
          <DropdownLink key="home" to="/">
            <Icon icon="home" /> Home
          </DropdownLink>
          <DropdownLink key="dashboard" to="/account-settings">
            <Icon icon="user" /> Account Settings
          </DropdownLink>
          {authStore.user.admin && (
            <Dropdown.Item key="admin" onSelect={this.goToAdmin}>
              <Icon icon="frame" /> Admin
            </Dropdown.Item>
          )}
          <LogoutButton appearance="dropdownItem">
            <Icon icon="sign-out" /> Logout
          </LogoutButton>
        </Dropdown>
      </Nav>
    );
  }

  getPublicMenu() {
    const buttons = [];
    if (usersSignInEnabled) {
      buttons.push(
        <Link key="sign-in" to="/sign-in" className="rs-btn rs-btn-primary">
          Sign In
        </Link>,
        <Link key="sign-up" to="/sign-up" className="rs-btn">
          Sign Up
        </Link>
      );
    }
    return buttons;
  }

  isAuthenticated() {
    const { authStore } = this.props;
    return !!(authStore.authenticated && authStore.user);
  }

  render() {
    const { className } = this.props;
    return (
      <div className={classNames('header-sub-nav', className)}>
        {!this.isAuthenticated() && this.getPublicMenu()}
        {this.isAuthenticated() && this.getAuthenticatedMenu()}
      </div>
    );
  }
}

HeaderSubNav.propTypes = {
  className: PropTypes.string,
  authStore: PropTypes.object,
  notificationsStore: PropTypes.object,
  history: PropTypes.object,
};

const enhance = compose(withRouter, inject('authStore', 'notificationsStore'), observer);

export default enhance(HeaderSubNav);
