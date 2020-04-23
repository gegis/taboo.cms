import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Link, withRouter } from 'react-router-dom';
import { autorun } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Container, Content, Grid, Row, Col, Message } from 'rsuite';
import { MetaTags } from 'react-meta-tags';

import config from '../../config';
import Header from './Header';
import Footer from './Footer';
import NotificationsHelper from 'app/modules/core/ui/helpers/NotificationsHelper';

import CopyInput from 'modules/core/ui/components/CopyInput';
import TemplatesHelper from 'modules/templates/ui/helpers/TemplatesHelper';

class Template extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { localeStore, notificationsStore, templatesStore, navigationStore, authStore } = this.props;
    TemplatesHelper.loadLibStylesheet('_shared');
    TemplatesHelper.loadStylesheet('_shared');
    TemplatesHelper.preloadTemplate(config.name, { templatesStore });
    this.dispose = autorun(() => {
      TemplatesHelper.loadStyle({ templatesStore });
      TemplatesHelper.preloadNavigation(config.name, { authStore, navigationStore, templatesStore });
      NotificationsHelper.handleNotifications(notificationsStore, localeStore);
    });
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
      <Container className={classNames('template', 'standard-template', className)}>
        <MetaTags>
          <title>{this.getMetaTitle()}</title>
        </MetaTags>
        <Header />
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
