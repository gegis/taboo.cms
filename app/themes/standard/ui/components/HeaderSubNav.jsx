import React from 'react';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Nav, Dropdown } from 'rsuite';
import { withRouter } from 'react-router-dom';
import Translation from 'modules/core/ui/components/Translation';
import ProfilePicture from 'modules/users/ui/components/ProfilePicture';
import ResponseHelper from 'modules/core/ui/helpers/ResponseHelper';
import NavLink from 'modules/core/ui/components/NavLink';
import DropdownLink from 'modules/core/ui/components/DropdownLink';
import LogoutButton from 'modules/core/ui/components/LogoutButton';

class HeaderSubNav extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
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

  getUserDropdown() {
    const { authStore } = this.props;
    return (
      <Nav className="user-menu signed-in" pullRight>
        <Dropdown
          icon={<ProfilePicture url={authStore.user.profilePictureUrl} size="xs" />}
          title={<span className="rs-hidden-sm">{authStore.user.email}</span>}
          placement="bottomEnd"
        >
          <DropdownLink key="my-profile" to="/my-profile">
            <Translation message="My Profile" />
          </DropdownLink>
          {authStore.user.id && !authStore.verified && (
            <DropdownLink key="account-verify" to="/account-verify">
              <Translation message="Account Verification" />
            </DropdownLink>
          )}
          {authStore.user.admin && <Dropdown.Item key="divider-verification" divider />}
          {authStore.user.admin && (
            <Dropdown.Item key="admin" onSelect={this.goToAdmin}>
              <Translation message="Admin" />
            </Dropdown.Item>
          )}
          <Dropdown.Item key="divider-logout" divider />
          <LogoutButton appearance="dropdownItem" />
        </Dropdown>
      </Nav>
    );
  }

  getUnauthenticatedMenu() {
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

  isAuthenticated() {
    const { authStore } = this.props;
    return !!(authStore.authenticated && authStore.user);
  }

  render() {
    if (this.isAuthenticated()) {
      return this.getUserDropdown();
    } else {
      return this.getUnauthenticatedMenu();
    }
  }
}

HeaderSubNav.propTypes = {
  authStore: PropTypes.object,
  history: PropTypes.object,
};

const enhance = compose(withRouter, inject('authStore'), observer);

export default enhance(HeaderSubNav);
