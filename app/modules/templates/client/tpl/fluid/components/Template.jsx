import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Link, withRouter } from 'react-router-dom';
import { autorun } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Container, Content, Grid, Row, Col, Message } from 'rsuite';
import { MetaTags } from 'react-meta-tags';

import config from '../config';
import Header from './Header';
import Footer from './Footer';
import NotificationsHelper from 'app/modules/core/client/helpers/NotificationsHelper';

import CopyInput from 'modules/core/client/components/CopyInput';
import TemplatesHelper from 'modules/templates/client/helpers/TemplatesHelper';

class Template extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { localeStore, notificationsStore, templatesStore } = this.props;
    TemplatesHelper.preloadTemplate(config.name, { templatesStore });
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
    const { children, uiStore, authStore, navigationStore, templatesStore, className } = this.props;
    TemplatesHelper.preloadNavigation(config.name, { authStore, navigationStore, templatesStore });
    return (
      <Container className={classNames('fluid-template', className)} style={{ backgroundColor: 'pink' }}>
        <MetaTags>
          <title>{this.getMetaTitle()}</title>
        </MetaTags>
        <Header />
        {uiStore.loading && <div className="loader" />}
        {authStore.user.id && !authStore.verified && this.getVerificationMessage()}
        <Content className="main-content">
          <Grid fluid={true}>
            <Row>
              <Col md={24}>{children}</Col>
            </Row>
          </Grid>
        </Content>
        <Footer />
        <CopyInput />
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
