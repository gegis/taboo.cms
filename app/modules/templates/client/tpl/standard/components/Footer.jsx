import React from 'react';
import { Footer as RsFooter, Grid, Row, Col } from 'rsuite';
import PropTypes from 'prop-types';
import { Nav } from 'rsuite';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import Translation from 'modules/core/client/components/Translation';
import NavLink from 'modules/core/client/components/NavLink';

class Footer extends React.Component {
  // TODO - move this into separate component
  getNavigationName() {
    const { authStore, templatesStore } = this.props;
    if (authStore.authenticated && authStore.user) {
      return templatesStore.languageSettings.footerNavigationAuthenticated;
    }
    return templatesStore.languageSettings.footerNavigation;
  }

  // TODO - move this into separate component
  getNavigation() {
    const { navigation } = this.props.navigationStore;
    const navigationName = this.getNavigationName();
    return (
      <Nav className="navigation signed-out">
        {/*TODO implement hierarchical menu output*/}
        {navigation[navigationName] &&
          navigation[navigationName].map((item, i) => (
            <NavLink key={i} className="rs-nav-item-content" to={item.url}>
              {item.title}
            </NavLink>
          ))}
      </Nav>
    );
  }

  render() {
    return (
      <RsFooter className="footer">
        <Grid fluid className="footer-copyright">
          <Row>
            <Col>{this.getNavigation()}</Col>
          </Row>
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
  navigationStore: PropTypes.object,
  templatesStore: PropTypes.object,
};

const enhance = compose(inject('authStore', 'navigationStore', 'templatesStore'), observer);

export default enhance(Footer);
