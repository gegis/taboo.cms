import React from 'react';
import { Footer as RsFooter, Grid, Row, Col } from 'rsuite';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import Navigation from 'app/themes/_shared/ui/components/Navigation';

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

  render() {
    return (
      <RsFooter className="footer">
        <Grid fluid className="footer-copyright">
          <Row>
            <Col>
              <Navigation navigationName={this.getNavigationName()} />
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
