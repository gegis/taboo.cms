import React from 'react';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Drawer, Button } from 'rsuite';
import { Link, withRouter } from 'react-router-dom';
import Translation from 'app/modules/core/client/components/Translation';
import ButtonLink from 'app/modules/core/client/components/ButtonLink';
import ProfilePicture from 'modules/users/client/components/ProfilePicture';
import LogoutButton from 'modules/core/client/components/LogoutButton';
import Navigation from './Navigation';

class MobileSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    const { tagName = '', className = '' } = event.target;
    const { uiStore } = this.props;
    const dropdownToggle = className.indexOf('rs-dropdown-toggle') !== -1;
    if ((tagName === 'A' && !dropdownToggle) || tagName === 'BUTTON') {
      uiStore.closeUserSidebar();
    }
  }

  close() {
    const { uiStore } = this.props;
    uiStore.closeUserSidebar();
  }

  goToAdmin() {
    window.location = '/admin';
  }

  getNavigationName() {
    const { authStore, templatesStore } = this.props;
    if (authStore.authenticated && authStore.user) {
      return templatesStore.languageSettings.headerNavigationAuthenticated;
    }
    return templatesStore.languageSettings.headerNavigation;
  }

  render() {
    const { authStore, uiStore } = this.props;
    return (
      <Drawer
        placement="right"
        size="xs"
        show={uiStore.userSidebarOpen}
        onHide={this.close}
        backdrop={true}
        className="user-sidebar"
      >
        <Drawer.Header />
        <Drawer.Body onClick={this.handleClick}>
          {authStore.authenticated && authStore.user && (
            <div>
              <ProfilePicture url={authStore.user.profilePictureUrl} size="xs" />
              {authStore.user.email}
              <div className="v-spacer-5" />
            </div>
          )}
          <Navigation navigationName={this.getNavigationName()} vertical={true} />
          {authStore.authenticated && authStore.user && authStore.user.admin && (
            <div>
              <div className="v-spacer-5" />
              <Button appearance="link" key="admin" onClick={this.goToAdmin}>
                <Translation message="Admin" />
              </Button>
            </div>
          )}
          {authStore.authenticated && authStore.user && (
            <div>
              <div className="v-spacer-5" />
              <LogoutButton appearance="primary" />
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
}

MobileSidebar.propTypes = {
  authStore: PropTypes.object,
  uiStore: PropTypes.object,
  templatesStore: PropTypes.object,
  history: PropTypes.object,
};

const enhance = compose(withRouter, inject('authStore', 'uiStore', 'templatesStore'), observer);

export default enhance(MobileSidebar);
