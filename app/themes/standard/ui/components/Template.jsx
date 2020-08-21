import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
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
    const { localeStore, notificationsStore, templatesStore } = this.props;
    TemplatesHelper.loadLibStylesheet('_shared');
    TemplatesHelper.loadStylesheet('_shared');
    TemplatesHelper.preloadTemplate(config.name, { templatesStore });
    this.dispose = autorun(() => {
      TemplatesHelper.loadStyle({ templatesStore });
      NotificationsHelper.handleNotifications(notificationsStore, localeStore);
    });
  }

  componentWillUnmount() {
    this.dispose();
  }

  getVerificationMessage() {
    const { authStore } = this.props;
    const { user, verified, emailVerified, verifyEmailNotification, verifyDocsNotification } = authStore;
    let messageBlock = null;
    let messages = [];

    if ((!verified || !emailVerified) && user.id) {
      if (!emailVerified) {
        messages.push(<div key="verify-email">{verifyEmailNotification}</div>);
      }
      if (!verified) {
        messages.push(<div key="verify-docs">{verifyDocsNotification}</div>);
      }
      messageBlock = <Message className="header-notification" type="error" description={messages} />;
    }

    return messageBlock;
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
    const {
      children,
      uiStore,
      className,
      title,
      contentStyle,
      headerStyle,
      metaKeywords = '',
      metaDescription = '',
      fluid = false,
    } = this.props;
    return (
      <Container className={classNames('template', 'standard-template', className)}>
        <MetaTags>
          <title>{this.getMetaTitle()}</title>
          <meta name="description" content={metaDescription} />
          <meta name="keywords" content={metaKeywords} />
        </MetaTags>
        <Header headerStyle={headerStyle} />
        {uiStore.loading && <div className="loader" />}
        {this.getVerificationMessage()}
        <Content className="main-content" style={contentStyle}>
          <Grid fluid={fluid}>
            <Row>
              <Col md={24}>
                <h1 className="title">{title}</h1>
                <div className="body">{children}</div>
              </Col>
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
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  metaTitle: PropTypes.string,
  metaKeywords: PropTypes.string,
  metaDescription: PropTypes.string,
  fluid: PropTypes.bool,
  headerStyle: PropTypes.object,
  contentStyle: PropTypes.object,
  uiStore: PropTypes.object,
  notificationsStore: PropTypes.object,
  localeStore: PropTypes.object,
  authStore: PropTypes.object,
  templatesStore: PropTypes.object,
};

const enhance = compose(
  withRouter,
  inject('uiStore', 'authStore', 'notificationsStore', 'localeStore', 'templatesStore'),
  observer
);

export default enhance(Template);
