import React from 'react';
import { Footer as RsFooter, Grid, Row, Col } from 'rsuite';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import Translation from 'modules/core/client/components/Translation';

class Footer extends React.Component {
  getFooterNavigation() {
    const { navigation } = this.props;
    if (navigation) {
      return (
        <Row>
          <Col>{navigation}</Col>
        </Row>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <RsFooter className="footer">
        <Grid fluid className="footer-copyright">
          {this.getFooterNavigation()}
          <Row>
            <Col>
              <Translation message="_footerCopy" />
            </Col>
          </Row>
        </Grid>
      </RsFooter>
    );
  }
}

Footer.propTypes = {
  authStore: PropTypes.object,
  navigation: PropTypes.node,
  userMenu: PropTypes.node,
};

const enhance = compose(inject('authStore'), observer);

export default enhance(Footer);
