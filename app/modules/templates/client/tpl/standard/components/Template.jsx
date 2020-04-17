import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Link, withRouter } from 'react-router-dom';
import { autorun } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Container, Content, Grid, Row, Col, Message } from 'rsuite';
import { MetaTags } from 'react-meta-tags';

import Header from './Header';
import Footer from './Footer';
import NotificationsHelper from 'app/modules/core/client/helpers/NotificationsHelper';

import config from '../config';

class Template extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { localeStore, notificationsStore, templatesStore, navigationStore, authStore } = this.props;
    templatesStore.loadTemplate(config.name).then(() => {
      if (authStore.authenticated && authStore.user) {
        navigationStore.loadByName(templatesStore.languageSettings.headerNavigationAuthenticated);
        navigationStore.loadByName(templatesStore.languageSettings.footerNavigationAuthenticated);
      } else {
        navigationStore.loadByName(templatesStore.languageSettings.headerNavigation);
        navigationStore.loadByName(templatesStore.languageSettings.footerNavigation);
      }
    });
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
        <Header />
        <h1>Default</h1>
        {uiStore.loading && <div className="loader" />}
        {authStore.user.id && !authStore.verified && this.getVerificationMessage()}
        <Content className="main-content">
          <Grid>
            <Row>
              <Col md={24}>{children}</Col>
            </Row>
          </Grid>
        </Content>
        <Footer />
        {/*TODO make this as stand alone component*/}
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

Template.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  metaTitle: PropTypes.string,
  uiStore: PropTypes.object,
  notificationsStore: PropTypes.object,
  localeStore: PropTypes.object,
  authStore: PropTypes.object,
  navigationStore: PropTypes.object,
  templatesStore: PropTypes.object,
};

const enhance = compose(
  withRouter,
  inject('uiStore', 'authStore', 'notificationsStore', 'localeStore', 'navigationStore', 'templatesStore'),
  observer
);

export default enhance(Template);
