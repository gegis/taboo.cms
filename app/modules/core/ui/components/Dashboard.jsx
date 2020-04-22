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
      <Template className="dashboard">
        <Grid>
          <Row>
            <Col md={16} mdOffset={4}>
              <h1>Dashboard</h1>
              <Panel className="dashboard" bordered>
                <Row>
                  <Col md={6}>
                    <div style={{ textAlign: 'center' }}>
                      <ProfilePicture url={authStore.user.profilePictureUrl} size="md" />
                    </div>
                    <div className="v-spacer-2" />
                  </Col>
                  <Col md={18}>
                    <p>
                      {authStore.user.firstName} {authStore.user.lastName}
                      <br />
                      {authStore.user.email}
                    </p>
                    <p>
                      <Link to="/my-profile">My Profile</Link>
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
