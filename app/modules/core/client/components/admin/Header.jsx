import React from 'react';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Header as RsHeader, Navbar, Nav, Icon, Dropdown } from 'rsuite';
import NavBrand from 'app/modules/core/client/components/admin/NavBrand';
import ResponseHelper from 'app/modules/core/client/helpers/ResponseHelper';
import Translation from 'app/modules/core/client/components/Translation';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    const { authStore } = this.props;
    axios
      .get('/api/logout')
      .then(response => {
        if (response && response.data && response.data.success) {
          authStore.loadUserAuth().then(() => {
            window.location = '/';
          });
        } else {
          throw new Error('Error logging out');
        }
      })
      .catch(ResponseHelper.handleError);
  }

  goToFrontEnd() {
    window.location = '/';
  }

  getUserMenu() {
    const { authStore } = this.props;
    if (authStore.authenticated && authStore.user) {
      return (
        <Dropdown
          icon={<Icon icon="user" size="lg" />}
          title={<span className="rs-hidden-xs">{authStore.user.email}</span>}
          placement="bottomEnd"
          className="user-menu"
        >
          <Dropdown.Item icon={<Icon icon="home" />} onSelect={this.goToFrontEnd}>
            <Translation message="Front End" />
          </Dropdown.Item>
          <Dropdown.Item icon={<Icon icon="sign-out" />} onSelect={this.handleLogout}>
            <Translation message="Logout" />
          </Dropdown.Item>
        </Dropdown>
      );
    }
    return null;
  }

  render() {
    const { sidebar, headerNav = null } = this.props;
    let appearance = 'subtle';
    if (!sidebar) {
      appearance = 'inverse';
    }
    return (
      <RsHeader className="header">
        <Navbar appearance={appearance}>
          {!sidebar && (
            <Navbar.Header>
              <NavBrand />
            </Navbar.Header>
          )}
          <Navbar.Body>
            {headerNav}
            <Nav pullRight>{this.getUserMenu()}</Nav>
          </Navbar.Body>
        </Navbar>
      </RsHeader>
    );
  }
}
Header.propTypes = {
  sidebar: PropTypes.bool,
  authStore: PropTypes.object,
  headerNav: PropTypes.node,
};

const enhance = compose(
  inject('authStore'),
  observer
);

export default enhance(Header);
