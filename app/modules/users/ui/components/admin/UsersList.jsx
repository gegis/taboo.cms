import React from 'react';
import { compose } from 'recompose';
import { IconButton, Icon } from 'rsuite';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ActionButtons from 'app/modules/core/ui/components/admin/ActionButtons';
import Translation from 'modules/core/ui/components/Translation';
import BooleanIcon from 'modules/core/ui/components/admin/BooleanIcon';
import UserAuthSettingsModal from 'modules/users/ui/components/admin/UserAuthSettingsModal';

class UsersList extends React.Component {
  constructor(props) {
    super(props);
    this.usersAdminStore = props.usersAdminStore;
    this.openEditModal = props.openEditModal;
    this.handleDelete = props.handleDelete;
    this.handleCopy = props.handleCopy;
    this.authModal = React.createRef();
    this.handleSelect = this.handleSelect.bind(this);
    this.handleAction = this.handleAction.bind(this);
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

  handleSelect(user) {
    const { usersAdminStore } = this.props;
    const { selected = [] } = usersAdminStore;
    let data = selected;
    let index = data.indexOf(user._id);
    if (index === -1) {
      data = data.concat(user._id);
    } else {
      data.splice(index, 1);
    }
    usersAdminStore.setSelected(data);
  }

  handleAction(event) {
    if (event === 'mark-as-exported') {
      this.updateExported(true);
    }
  }

  updateExported(value) {
    const { usersAdminStore } = this.props;
    const { selected } = usersAdminStore;
    if (selected.length > 0) {
      usersAdminStore.updateSelectedUsersFields('exported', value);
    }
  }

  render() {
    return (
      <div>
        {/*TODO Uncomment this once ui confirmed*/}
        {/*<Dropdown icon={<Icon icon="ellipsis-v" />} onSelect={this.handleAction.bind(this)}>*/}
        {/*  <Dropdown.Item eventKey="mark-as-exported" icon={<Icon icon="file" />}>*/}
        {/*    Mark as Exported*/}
        {/*  </Dropdown.Item>*/}
        {/*</Dropdown>*/}
        <table>
          <thead>
            <tr>
              {/*<th className="rs-hidden-sm"></th>*/}
              <th className="rs-visible-sm">User</th>
              <th className="rs-hidden-sm">User</th>
              <th className="rs-hidden-sm">Verified</th>
              <th className="rs-hidden-sm">Admin</th>
              <th className="rs-hidden-sm">Active</th>
              <th className="action-buttons-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.usersAdminStore.items.map(item => (
              <tr key={item._id}>
                {/*<td className="rs-hidden-sm">*/}
                {/*  <Checkbox onChange={this.handleSelect.bind(this, item)} />*/}
                {/*</td>*/}
                <td className="rs-visible-sm mobile-view-td">
                  <div>{item.username}</div>
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
                  <div>{item.username}</div>
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
  usersAdminStore: PropTypes.object.isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleCopy: PropTypes.func.isRequired,
};

const enhance = compose(inject('usersAdminStore'), observer);

export default enhance(UsersList);
