import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Panel, Grid, Row, Col, Nav, Icon, DateRangePicker } from 'rsuite';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';

import Layout from 'app/themes/admin/ui/components/Layout';
import Translation from 'app/modules/core/ui/components/Translation';
import NavLink from 'app/modules/core/ui/components/admin/NavLink';
import ResponseHelper from 'app/modules/core/ui/helpers/ResponseHelper';
import { autorun } from 'mobx';

const { dateFormat } = window.app.config;

class IndexPage extends Component {
  constructor(props) {
    super(props);
    this.aclStore = props.aclStore;
    this.dispose = autorun(() => {
      this.retrieveAllData();
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
    this.filterByDateRange = this.filterByDateRange.bind(this);
  }

  componentWillUnmount() {
    this.dispose();
  }

  getRequestParams(filter) {
    const params = {};
    if (filter) {
      params.params = {
        filter: filter,
      };
    }
    return params;
  }

  retrieveAllData(filter = null) {
    if (this.aclStore.isAllowed(this.aclStore.userACL, 'admin.pages.view')) {
      this.retrievePagesInfo(filter);
    }
    if (this.aclStore.isAllowed(this.aclStore.userACL, 'admin.galleries.view')) {
      this.retrieveGalleriesInfo(filter);
    }
    if (this.aclStore.isAllowed(this.aclStore.userACL, 'admin.uploads.view')) {
      this.retrieveUploadsInfo(filter);
    }
    if (this.aclStore.isAllowed(this.aclStore.userACL, 'admin.users.view')) {
      this.retrieveUsersInfo(filter);
    }
  }

  retrievePagesInfo(filter) {
    const params = this.getRequestParams(filter);
    axios
      .get('/api/admin/pages/count', params)
      .then(response => {
        if (response && response.data) {
          this.setState({ pages: { count: response.data.count } });
        }
      })
      .catch(ResponseHelper.handleError);
  }

  retrieveGalleriesInfo(filter) {
    const params = this.getRequestParams(filter);
    axios
      .get('/api/admin/galleries/count', params)
      .then(response => {
        if (response && response.data) {
          this.setState({ galleries: { count: response.data.count } });
        }
      })
      .catch(ResponseHelper.handleError);
  }

  retrieveUploadsInfo(filter) {
    const params = this.getRequestParams(filter);
    axios
      .get('/api/admin/uploads/count', params)
      .then(response => {
        if (response && response.data) {
          this.setState({ uploads: { count: response.data.count } });
        }
      })
      .catch(ResponseHelper.handleError);
  }

  retrieveUsersInfo(filter) {
    const params = this.getRequestParams(filter);
    axios
      .get('/api/admin/users/count', params)
      .then(response => {
        if (response && response.data) {
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
        {this.aclStore.isAllowed(this.aclStore.userACL, 'admin.casinos.view') && (
          <NavLink to="/admin/casinos" icon={<Icon icon="bank" />}>
            <span className="rs-hidden-sm">Casinos</span>
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

  getActionButtons() {
    const buttons = [];
    buttons.push(
      <DateRangePicker
        key="date-range-filter"
        isoWeek={true}
        placement="bottomEnd"
        appearance="default"
        placeholder="Filter by Date Created"
        style={{ width: 230 }}
        format={dateFormat}
        onChange={this.filterByDateRange}
      />
    );
    return buttons;
  }

  filterByDateRange(dates) {
    let filter = null;
    let from, to;
    if (Object.keys(dates).length > 1) {
      from = new Date(dates[0]);
      from.setHours(0, 0, 0);
      to = new Date(dates[1]);
      to.setHours(23, 59, 59);
      filter = {
        createdAt: {
          $gte: from,
          $lte: to,
        },
      };
    }

    this.retrieveAllData(filter);
  }

  render() {
    const { pages, users, uploads, galleries } = this.state;
    return (
      <Layout
        pageTitle="Dashboard"
        headerNav={this.getHeaderNav()}
        pageActions={this.getActionButtons()}
        className="dashboard"
      >
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
