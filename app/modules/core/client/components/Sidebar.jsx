import React from 'react';
import axios from 'axios';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Drawer, Button } from 'rsuite';
import { Link, withRouter } from 'react-router-dom';
import Translation from 'app/modules/core/client/components/Translation';
import ButtonLink from 'app/modules/core/client/components/ButtonLink';
import ResponseHelper from 'modules/core/client/helpers/ResponseHelper';
import ProfilePicture from 'modules/users/client/components/ProfilePicture';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleClick(event) {
    const { tagName = '' } = event.target;
    const { settingsStore } = this.props;
    if (tagName === 'A' || tagName === 'BUTTON') {
      settingsStore.closeUserSidebar();
    }
  }

  close() {
    const { settingsStore } = this.props;
    settingsStore.closeUserSidebar();
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

  goToAdmin() {
    window.location = '/admin';
  }

  render() {
    const { authStore, navigation, settingsStore } = this.props;
    return (
      <Drawer
        placement="right"
        size="xs"
        show={settingsStore.userSidebarOpen}
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
          <div>{navigation}</div>
          {authStore.authenticated && authStore.user && authStore.user.admin && (
            <div>
              <div className="v-spacer-5" />
              <ButtonLink appearance="link" key="admin" onClick={this.goToAdmin}>
                <Translation message="Admin" />
              </ButtonLink>
            </div>
          )}
          {authStore.authenticated && authStore.user && (
            <div>
              <div className="v-spacer-5" />
              <Button key="logout" appearance="primary" onClick={this.handleLogout}>
                <Translation message="Logout" />
              </Button>
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

Sidebar.propTypes = {
  authStore: PropTypes.object,
  settingsStore: PropTypes.object,
  navigation: PropTypes.node,
  history: PropTypes.object,
};

const enhance = compose(withRouter, inject('authStore', 'settingsStore'), observer);

export default enhance(Sidebar);
