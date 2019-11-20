import React from 'react';
import { Form, FormGroup, FormControl, Panel, IconButton, Icon, Notification, Button } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Layout from 'modules/core/client/components/admin/Layout';
import Translation from 'app/modules/core/client/components/Translation';
import CreateUser from './CreateUser';
import EditUser from './EditUser';
import BooleanIcon from 'app/modules/core/client/components/admin/BooleanIcon';
import ActionButtons from 'app/modules/core/client/components/admin/ActionButtons';

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.aclStore = props.aclStore;
    this.usersStore = props.usersStore;
    this.rolesStore = props.rolesStore;
    this.localeStore = props.localeStore;
    this.settingsStore = props.settingsStore;
    this.createModal = React.createRef();
    this.editModal = React.createRef();
    this.openCreate = this.openCreate.bind(this);
    this.openEdit = this.openEdit.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.onLoadMore = this.onLoadMore.bind(this);
  }

  componentDidMount() {
    this.usersStore.loadAll();
  }

  onSearchChange(value) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.settingsStore.setLoading(true);
      this.usersStore.loadAll({ search: value }).then(() => {
        this.settingsStore.setLoading(false);
      });
    }, 700);
  }

  getHeaderNav() {
    return (
      <Form layout="inline">
        <FormGroup>
          <FormControl
            name="page"
            placeholder="Search Users"
            style={{ width: '40vw' }}
            onChange={this.onSearchChange}
            value={this.usersStore.search}
          />
        </FormGroup>
      </Form>
    );
  }

  getPageActions() {
    return (
      <IconButton icon={<Icon icon="user" />} appearance="primary" onClick={this.openCreate}>
        <Translation message="Create New" />
      </IconButton>
    );
  }

  openCreate() {
    const { wrappedInstance } = this.createModal.current;
    if (wrappedInstance) {
      if (this.aclStore.isAllowed(this.aclStore.userACL, 'admin.acl.view')) {
        this.rolesStore.loadAllRolesForSelection().then(() => {
          wrappedInstance.open();
        });
      } else {
        wrappedInstance.open();
      }
    }
  }

  openEdit(id) {
    const { wrappedInstance } = this.editModal.current;
    if (wrappedInstance) {
      if (this.aclStore.isAllowed(this.aclStore.userACL, 'admin.acl.view')) {
        this.rolesStore.loadAllRolesForSelection().then(() => {
          wrappedInstance.open(id);
        });
      } else {
        wrappedInstance.open(id);
      }
    }
  }

  handleDelete(id) {
    this.usersStore.deleteById(id).then(() => {
      Notification.open({
        title: 'Message',
        description: this.localeStore.getTranslation('Successfully deleted'),
        duration: 5000,
      });
    });
  }

  handleSort(field, direction) {
    this.usersStore.sortUsers(field, direction);
  }

  onLoadMore() {
    this.settingsStore.setLoading(true);
    this.usersStore.loadNextPage().then(() => {
      this.settingsStore.setLoading(false);
    });
  }

  getLoadMoreButton() {
    return (
      <div className="load-more-wrapper">
        <Button appearance="primary" onClick={this.onLoadMore}>
          <Translation message="Load More" />
          ...
        </Button>
      </div>
    );
  }

  getUserRoles(user) {
    const roles = [];
    if (user && user.roles && Array.isArray(user.roles)) {
      user.roles.map(role => {
        roles.push(role.name);
      });
    }
    return roles;
  }

  render() {
    return (
      <Layout className="users" headerNav={this.getHeaderNav()} pageTitle="Users" pageActions={this.getPageActions()}>
        <Panel className="shadow">
          {this.usersStore.users.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th className="rs-visible-xs">User</th>
                  <th className="rs-hidden-sm rs-hidden-xs">User</th>
                  <th className="rs-hidden-xs">Company</th>
                  <th className="rs-hidden-xs">Verified</th>
                  <th className="rs-hidden-xs">Admin</th>
                  <th className="rs-hidden-xs">Active</th>
                  <th className="action-buttons-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.usersStore.users.map(item => (
                  <tr key={item._id}>
                    <td className="rs-visible-xs mobile-view-td">
                      <div>
                        {item.firstName} {item.lastName}
                      </div>
                      <div>{item.email}</div>
                      <div className="subject">
                        <div>{this.getUserRoles(item).join(', ')}</div>
                      </div>
                      <div>
                        <BooleanIcon value={item.verified} />{' '}
                        <span className="subject">
                          <Translation message="verified" />
                        </span>
                      </div>
                      <div>
                        <BooleanIcon value={item.admin} />{' '}
                        <span className="subject">
                          <Translation message="admin" />
                        </span>
                      </div>
                      <div className="subject sm">{item._id}</div>
                    </td>
                    <td className="rs-hidden-sm rs-hidden-xs max-overflow">
                      <div>
                        {item.firstName} {item.lastName}
                      </div>
                      <div>{item.email}</div>
                      <div className="subject">{this.getUserRoles(item).join(', ')}</div>
                    </td>
                    <td className="rs-hidden-xs">
                      <BooleanIcon value={item.businessAccount} />
                    </td>
                    <td className="rs-hidden-xs">
                      <BooleanIcon value={item.verified} />
                      <div>{item.verificationStatus}</div>
                    </td>
                    <td className="rs-hidden-xs">
                      <BooleanIcon value={item.admin} />
                    </td>
                    <td className="rs-hidden-xs">
                      <BooleanIcon value={item.active} />
                    </td>
                    <td>
                      <ActionButtons value={item._id} onEdit={this.openEdit} onDelete={this.handleDelete} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {this.usersStore.users.length > 0 && this.usersStore.hasMoreResults && this.getLoadMoreButton()}
          {this.usersStore.users.length === 0 && (
            <div className="">
              <Translation message="No results found" />
            </div>
          )}
        </Panel>
        <CreateUser ref={this.createModal} />
        <EditUser ref={this.editModal} />
      </Layout>
    );
  }
}

Users.propTypes = {
  aclStore: PropTypes.object.isRequired,
  usersStore: PropTypes.object.isRequired,
  rolesStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
  settingsStore: PropTypes.object.isRequired,
};

const enhance = compose(
  inject('aclStore', 'usersStore', 'rolesStore', 'localeStore', 'settingsStore'),
  observer
);

export default enhance(Users);
