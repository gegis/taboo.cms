import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Panel, Grid, Row, Col, Nav, Icon } from 'rsuite';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';

import Layout from 'app/themes/admin/client/components/Layout';
import Translation from 'app/modules/core/client/components/Translation';
import NavLink from 'app/modules/core/client/components/admin/NavLink';
import ResponseHelper from 'app/modules/core/client/helpers/ResponseHelper';
import { autorun } from 'mobx';

class IndexPage extends Component {
  constructor(props) {
    super(props);
    this.aclStore = props.aclStore;
    this.dispose = autorun(() => {
      if (this.aclStore.isAllowed(this.aclStore.userACL, 'admin.pages.view')) {
        this.retrievePagesInfo();
      }
      if (this.aclStore.isAllowed(this.aclStore.userACL, 'admin.galleries.view')) {
        this.retrieveGalleriesInfo();
      }
      if (this.aclStore.isAllowed(this.aclStore.userACL, 'admin.uploads.view')) {
        this.retrieveUploadsInfo();
      }
      if (this.aclStore.isAllowed(this.aclStore.userACL, 'admin.users.view')) {
        this.retrieveUsersInfo();
      }
    });
    this.state = {
      galleries: {
        count: 0,
      },
      pages: {
        count: 0,
      },
      uploads: {
        count: 0,
      },
      users: {
        count: 0,
      },
    };
  }

  componentWillUnmount() {
    this.dispose();
  }

  retrieveGalleriesInfo() {
    axios
      .get('/api/admin/galleries/count')
      .then(response => {
        if (response && response.data && response.data.count) {
          this.setState({ galleries: { count: response.data.count } });
        }
      })
      .catch(ResponseHelper.handleError);
  }

  retrievePagesInfo() {
    axios
      .get('/api/admin/pages/count')
      .then(response => {
        if (response && response.data && response.data.count) {
          this.setState({ pages: { count: response.data.count } });
        }
      })
      .catch(ResponseHelper.handleError);
  }

  retrieveUploadsInfo() {
    axios
      .get('/api/admin/uploads/count')
      .then(response => {
        if (response && response.data && response.data.count) {
          this.setState({ uploads: { count: response.data.count } });
        }
      })
      .catch(ResponseHelper.handleError);
  }

  retrieveUsersInfo() {
    axios
      .get('/api/admin/users/count')
      .then(response => {
        if (response && response.data && response.data.count) {
          this.setState({ users: { count: response.data.count } });
        }
      })
      .catch(ResponseHelper.handleError);
  }

  getHeaderNav() {
    return (
      <Nav>
        {this.aclStore.isAllowed(this.aclStore.userACL, 'admin.pages.view') && (
          <NavLink to="/admin/pages" icon={<Icon icon="file" />}>
            <span className="rs-hidden-sm">Pages</span>
          </NavLink>
        )}
        {this.aclStore.isAllowed(this.aclStore.userACL, 'admin.galleries.view') && (
          <NavLink to="/admin/galleries" icon={<Icon icon="file-image-o" />}>
            <span className="rs-hidden-sm">Galleries</span>
          </NavLink>
        )}
        {this.aclStore.isAllowed(this.aclStore.userACL, 'admin.uploads.view') && (
          <NavLink to="/admin/uploads" icon={<Icon icon="file-upload" />}>
            <span className="rs-hidden-sm">Uploads</span>
          </NavLink>
        )}
        {this.aclStore.isAllowed(this.aclStore.userACL, 'admin.users.view') && (
          <NavLink to="/admin/users" icon={<Icon icon="group" />}>
            <span className="rs-hidden-sm">Users</span>
          </NavLink>
        )}
      </Nav>
    );
  }

  render() {
    const { galleries, pages, users, uploads } = this.state;
    return (
      <Layout pageTitle="Dashboard" headerNav={this.getHeaderNav()} className="dashboard">
        <Grid fluid className="grid-default-gutter">
          <Row>
            {this.aclStore.isAllowed(this.aclStore.userACL, 'admin.pages.view') && (
              <Col xs={24} sm={12}>
                <Panel header={<Translation message="Pages" />} className="shadow">
                  <p className="counts">
                    <b>Total Count:</b> {pages.count}
                  </p>
                  <p className="pull-right">
                    <Link to={'/admin/pages'}>Pages</Link>
                  </p>
                  <div className="clearfix" />
                </Panel>
              </Col>
            )}
            {this.aclStore.isAllowed(this.aclStore.userACL, 'admin.galleries.view') && (
              <Col xs={24} sm={12}>
                <Panel header={<Translation message="Galleries" />} className="shadow">
                  <p className="counts">
                    <b>Total Count:</b> {galleries.count}
                  </p>
                  <p className="pull-right">
                    <Link to={'/admin/galleries'}>Galleries</Link>
                  </p>
                  <div className="clearfix" />
                </Panel>
              </Col>
            )}
            {this.aclStore.isAllowed(this.aclStore.userACL, 'admin.uploads.view') && (
              <Col xs={24} sm={12}>
                <Panel header={<Translation message="Uploads" />} className="shadow">
                  <p className="counts">
                    <b>Total Count:</b> {uploads.count}
                  </p>
                  <p className="pull-right">
                    <Link to={'/admin/uploads'}>Uploads</Link>
                  </p>
                  <div className="clearfix" />
                </Panel>
              </Col>
            )}
            {this.aclStore.isAllowed(this.aclStore.userACL, 'admin.users.view') && (
              <Col xs={24} sm={12}>
                <Panel header={<Translation message="Users" />} className="shadow">
                  <p className="counts">
                    <b>Total Count:</b> {users.count}
                  </p>
                  <p className="pull-right">
                    <Link to={'/admin/users'}>Users</Link>
                  </p>
                  <div className="clearfix" />
                </Panel>
              </Col>
            )}
          </Row>
        </Grid>
      </Layout>
    );
  }
}

IndexPage.propTypes = {
  aclStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('aclStore'), observer);

export default enhance(IndexPage);
