import React from 'react';
import { compose } from 'recompose';
import { IconButton, Icon } from 'rsuite';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ActionButtons from 'app/modules/core/client/components/admin/ActionButtons';
import Translation from 'modules/core/client/components/Translation';
import BooleanIcon from 'modules/core/client/components/admin/BooleanIcon';
import UserAuthSettingsModal from 'modules/users/client/components/admin/UserAuthSettingsModal';

class UsersList extends React.Component {
  constructor(props) {
    super(props);
    this.usersStore = props.usersStore;
    this.openEditModal = props.openEditModal;
    this.handleDelete = props.handleDelete;
    this.handleCopy = props.handleCopy;
    this.authModal = React.createRef();
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

  handleAuth(id) {
    const { current } = this.authModal;
    if (current) {
      current.open(id);
    }
  }

  getCustomButtons(id) {
    return [
      <IconButton
        className="auth-btn"
        key="auth"
        appearance="default"
        onClick={this.handleAuth.bind(this, id)}
        title="User Authentication Settings"
        icon={<Icon icon="unlock-alt" />}
      />,
    ];
  }

  render() {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th className="rs-visible-sm">User</th>
              <th className="rs-hidden-sm">User</th>
              <th className="rs-hidden-sm">Verified</th>
              <th className="rs-hidden-sm">Admin</th>
              <th className="rs-hidden-sm">Active</th>
              <th className="action-buttons-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.usersStore.items.map(item => (
              <tr key={item._id}>
                <td className="rs-visible-sm mobile-view-td">
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
                <td className="rs-hidden-sm max-overflow">
                  <div>
                    {item.firstName} {item.lastName}
                  </div>
                  <div>{item.email}</div>
                  <div className="subject">{this.getUserRoles(item).join(', ')}</div>
                </td>
                <td className="rs-hidden-sm">
                  <BooleanIcon value={item.verified} />
                  <div>{item.verificationStatus}</div>
                </td>
                <td className="rs-hidden-sm">
                  <BooleanIcon value={item.admin} />
                </td>
                <td className="rs-hidden-sm">
                  <BooleanIcon value={item.active} />
                </td>
                <td>
                  <ActionButtons
                    value={item._id}
                    onEdit={this.openEditModal}
                    onDelete={this.handleDelete}
                    customButtons={this.getCustomButtons(item._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <UserAuthSettingsModal ref={this.authModal} />
      </div>
    );
  }
}

UsersList.propTypes = {
  usersStore: PropTypes.object.isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleCopy: PropTypes.func.isRequired,
};

const enhance = compose(inject('usersStore'), observer);

export default enhance(UsersList);
