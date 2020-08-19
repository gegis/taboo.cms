import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import { Col, Grid, Row, Panel } from 'rsuite';

import ProfilePicture from 'modules/users/ui/components/ProfilePicture';

class Dashboard extends Component {
  render() {
    const { authStore, templatesStore } = this.props;
    const { templateComponents } = templatesStore;
    const Template = templateComponents[templatesStore.defaultTemplateName];
    return (
      <Template className="dashboard" title="User Profile" metaTitle="User Profile" headerMinimized={true}>
        <Grid>
          <Row>
            <Col sm={24} md={12} mdOffset={6}>
              <Panel className="dashboard single-panel" bordered>
                <Row>
                  <Col>
                    <h1>My Account</h1>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <div style={{ textAlign: 'center' }}>
                      <ProfilePicture url={authStore.user.profilePictureUrl} size="xl" />
                    </div>
                  </Col>
                  <Col md={18}>
                    <h3>{authStore.user.username}</h3>
                    <h4>{authStore.user.email}</h4>
                    <p>
                      <Link to="/my-profile">Account Settings</Link>
                    </p>
                  </Col>
                </Row>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </Template>
    );
  }
}

Dashboard.propTypes = {
  authStore: PropTypes.object,
  templatesStore: PropTypes.object,
};

const enhance = compose(inject('authStore', 'templatesStore'), observer);

export default enhance(Dashboard);
