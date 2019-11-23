import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ActionButtons from 'app/modules/core/client/components/admin/ActionButtons';
import Translation from 'modules/core/client/components/Translation';
import BooleanIcon from 'modules/core/client/components/admin/BooleanIcon';

class UsersList extends React.Component {
  constructor(props) {
    super(props);
    this.usersStore = props.usersStore;
    this.openEditModal = props.openEditModal;
    this.handleDelete = props.handleDelete;
    this.handleCopy = props.handleCopy;
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
          {this.usersStore.items.map(item => (
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
                <ActionButtons value={item._id} onEdit={this.openEditModal} onDelete={this.handleDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
