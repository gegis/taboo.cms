import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { autorun } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Container, Content, Grid, Row, Col } from 'rsuite';
import { MetaTags } from 'react-meta-tags';

import config from '../../config';
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
    const { children, uiStore, className, fluid = false } = this.props;
    return (
      <Container id="main-container" className={classNames('main-container', 'template', 'blank-template', className)}>
        <MetaTags>
          <title>{this.getMetaTitle()}</title>
        </MetaTags>
        {uiStore.loading && <div className="loader" />}
        <Content className="main-content">
          <Grid fluid={fluid}>
            <Row>
              <Col md={24}>{children}</Col>
            </Row>
          </Grid>
        </Content>
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
  templatesStore: PropTypes.object,
  fluid: PropTypes.bool,
};

const enhance = compose(withRouter, inject('uiStore', 'notificationsStore', 'localeStore', 'templatesStore'), observer);

export default enhance(Template);
