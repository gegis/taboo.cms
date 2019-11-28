import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import { Col, Grid, Row, Panel } from 'rsuite';

import Layout from 'app/modules/core/client/components/Layout';
import ProfilePicture from 'modules/users/client/components/ProfilePicture';

class IndexPage extends Component {
  render() {
    const { authStore } = this.props;
    return (
      <Layout className="dashboard">
        <Grid>
          <Row>
            <Col md={16} mdOffset={4}>
              <h1>Dashboard</h1>
              <Panel className="dashboard" bordered>
                <div>
                  <p>
                    <ProfilePicture url={authStore.user.profilePictureUrl} size="md" />
                  </p>
                  <p>
                    {authStore.user.firstName} {authStore.user.lastName}
                    <br />
                    {authStore.user.email}
                  </p>
                  <p>
                    <Link to="/my-profile">My Profile</Link>
                  </p>
                </div>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </Layout>
    );
  }
}

IndexPage.propTypes = {
  authStore: PropTypes.object,
};

const enhance = compose(inject('authStore'), observer);

export default enhance(IndexPage);
