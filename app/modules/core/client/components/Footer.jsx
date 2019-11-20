import React from 'react';
import { Footer as RsFooter, Grid, Row, Col } from 'rsuite';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';

class Footer extends React.Component {
  getUserFooter() {
    const { authStore, publicNav } = this.props;
    if (authStore.authenticated && authStore.user) {
      return (
        <Grid className="user-footer">
          <Row>
            <Col md={12} className="rs-visible-xs rs-visible-sm">
              <div className="public-nav-wrapper">{publicNav}</div>
            </Col>
            <Col md={12} className="rs-hidden-xs rs-hidden-sm">
              <div className="pull-right public-nav-wrapper">{publicNav}</div>
            </Col>
          </Row>
        </Grid>
      );
    }
    return null;
  }

  render() {
    return (
      <RsFooter className="footer">
        {this.getUserFooter()}
        <Grid fluid className="footer-copyright">
          <Row>
            <Col md={24}>&copy; 2019. All rights reserved</Col>
          </Row>
        </Grid>
      </RsFooter>
    );
  }
}

Footer.propTypes = {
  authStore: PropTypes.object,
  publicNav: PropTypes.node,
  topRightMenu: PropTypes.node,
};

const enhance = compose(
  inject('authStore'),
  observer
);

export default enhance(Footer);
