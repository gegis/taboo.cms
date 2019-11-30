import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ActionButtons from 'app/modules/core/client/components/admin/ActionButtons';

class RolesList extends React.Component {
  constructor(props) {
    super(props);
    this.rolesStore = props.rolesStore;
    this.openEditModal = props.openEditModal;
    this.handleDelete = props.handleDelete;
    this.handleCopy = props.handleCopy;
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th className="rs-hidden-xs">ID</th>
            <th>Name</th>
            <th>Resources</th>
            <th className="action-buttons-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {this.rolesStore.items.map(item => (
            <tr key={item._id}>
              <td className="id rs-hidden-xs">{item._id}</td>
              <td>{item.name}</td>
              <td>{item.resources.length}</td>
              <td>
                <ActionButtons
                  value={item._id}
                  copyValue={item.name}
                  onEdit={this.openEditModal}
                  onDelete={this.handleDelete}
                  onCopy={this.handleCopy}
                  copyTitle="Copy role name"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

RolesList.propTypes = {
  rolesStore: PropTypes.object.isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleCopy: PropTypes.func.isRequired,
};

const enhance = compose(inject('rolesStore'), observer);

export default enhance(RolesList);
