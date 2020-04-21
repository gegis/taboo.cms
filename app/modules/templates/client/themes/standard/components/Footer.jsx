import React from 'react';
import { Footer as RsFooter, Grid, Row, Col } from 'rsuite';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import Navigation from 'modules/templates/client/themesAssets/components/Navigation';

class Footer extends React.Component {
  getNavigationName() {
    const { authStore, templatesStore } = this.props;
    if (authStore.authenticated && authStore.user) {
      return templatesStore.languageSettings.footerNavigationAuthenticated;
    }
    return templatesStore.languageSettings.footerNavigation;
  }

  getFooterCopyright() {
    const { templatesStore } = this.props;
    return templatesStore.languageSettings.footerCopyright || null;
  }

  getFooterStyles() {
    const {
      templatesStore: { settings: { footerColor = '#142a3e', footerTextColor = '#fafafa' } = {} } = {},
    } = this.props;
    return {
      color: footerTextColor,
      backgroundColor: footerColor,
    };
  }

  render() {
    return (
      <RsFooter className="footer" style={this.getFooterStyles()}>
        <Grid fluid className="footer-copyright">
          <Row>
            <Col>
              <Navigation navigationName={this.getNavigationName()} style={this.getFooterStyles()} />
            </Col>
          </Row>
          <Row>
            <Col>
              <span dangerouslySetInnerHTML={{ __html: this.getFooterCopyright() }} />
            </Col>
          </Row>
        </Grid>
      </RsFooter>
    );
  }
}

Footer.propTypes = {
  authStore: PropTypes.object,
  navigationStore: PropTypes.object,
  templatesStore: PropTypes.object,
};

const enhance = compose(inject('authStore', 'navigationStore', 'templatesStore'), observer);

export default enhance(Footer);
