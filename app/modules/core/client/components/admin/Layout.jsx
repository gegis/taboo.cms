import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { autorun } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Container, Content, ButtonToolbar } from 'rsuite';

import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Translation from 'app/modules/core/client/components/Translation';
import NotificationsHelper from 'app/modules/core/client/helpers/NotificationsHelper';

class Layout extends React.Component {
  componentDidMount() {
    const { notificationsStore, localeStore } = this.props;
    this.dispose = autorun(NotificationsHelper.handleNotifications.bind(this, notificationsStore, localeStore));
  }
  componentWillUnmount() {
    this.dispose();
  }
  getContentHeader() {
    const { pageTitle, pageActions } = this.props;
    let header = [];
    if (pageTitle || pageActions) {
      if (pageTitle) {
        header.push(
          <div key={1} className="pull-left">
            <h2>
              <Translation message={pageTitle} />
            </h2>
          </div>
        );
      }
      if (pageActions) {
        header.push(
          <div key={2} className="pull-right">
            <ButtonToolbar>{pageActions}</ButtonToolbar>
          </div>
        );
      }
      return (
        <div className="main-content-header">
          {header}
          <div className="clearfix" />
        </div>
      );
    }
    return <div className="main-content-header-blank" />;
  }

  render() {
    const { children, headerNav, className, settingsStore, authStore } = this.props;
    let { sidebar = true } = this.props;
    let sidebarClass = '';
    if (!authStore.authenticated) {
      sidebar = false;
    }
    if (sidebar) {
      sidebarClass = settingsStore.open ? 'sidebar-open' : 'sidebar-closed';
      sidebarClass += ' rs-container-has-sidebar';
    }
    return (
      <Container className={classNames('admin-layout', className, sidebarClass)}>
        {sidebar && <Sidebar />}
        <Container>
          <Header sidebar={sidebar} headerNav={headerNav} />
          {settingsStore.loading && <div className="loader" />}
          <Content className="main-content">
            {this.getContentHeader()}
            {children}
          </Content>
          <Footer>Footer</Footer>
          <textarea
            className="helper-copy-value-input"
            ref={el => {
              window.copyValueInput = el;
            }}
          />
        </Container>
      </Container>
    );
  }
}

Layout.propTypes = {
  headerNav: PropTypes.node,
  pageTitle: PropTypes.node,
  pageActions: PropTypes.node,
  sidebar: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  settingsStore: PropTypes.object,
  notificationsStore: PropTypes.object,
  localeStore: PropTypes.object,
  authStore: PropTypes.object,
};

const enhance = compose(
  inject('settingsStore', 'authStore', 'notificationsStore', 'localeStore'),
  observer
);

export default enhance(Layout);
