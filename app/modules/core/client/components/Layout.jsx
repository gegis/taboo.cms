import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Link, withRouter } from 'react-router-dom';
import { autorun } from 'mobx';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { Container, Content, Grid, Row, Col, Nav, Message } from 'rsuite';
import Header from 'app/modules/core/client/components/Header';
import Footer from 'app/modules/core/client/components/Footer';
import NavLink from 'app/modules/core/client/components/NavLink';
import NotificationsHelper from 'app/modules/core/client/helpers/NotificationsHelper';

class Layout extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { localeStore, notificationsStore } = this.props;
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

  getPublicNav() {
    return (
      <Nav className="public-nav">
        <NavLink className="rs-nav-item-content" to="/">
          About
        </NavLink>
        <NavLink className="rs-nav-item-content" to="/">
          Terms
        </NavLink>
        <NavLink className="rs-nav-item-content" to="/">
          How it Works
        </NavLink>
        <NavLink className="rs-nav-item-content" to="/">
          Security
        </NavLink>
        <NavLink className="rs-nav-item-content" to="/">
          Contact
        </NavLink>
      </Nav>
    );
  }

  render() {
    const { children, topMenuSearch, topRightMenu, settingsStore, authStore, className } = this.props;
    return (
      <Container className={classNames('default-layout print-hidden', className)}>
        <Header publicNav={this.getPublicNav()} topMenuSearch={topMenuSearch} topRightMenu={topRightMenu} />
        {settingsStore.loading && <div className="loader" />}
        {authStore.user.id && !authStore.verified && this.getVerificationMessage()}
        <Content className="main-content">
          <Grid>
            <Row>
              <Col md={24}>{children}</Col>
            </Row>
          </Grid>
        </Content>
        <Footer publicNav={this.getPublicNav()} />
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

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  topMenuSearch: PropTypes.node,
  topRightMenu: PropTypes.node,
  className: PropTypes.string,
  settingsStore: PropTypes.object,
  notificationsStore: PropTypes.object,
  localeStore: PropTypes.object,
  authStore: PropTypes.object,
  location: PropTypes.object,
};

const enhance = compose(
  withRouter,
  inject('settingsStore', 'authStore', 'notificationsStore', 'localeStore'),
  observer
);

export default enhance(Layout);
