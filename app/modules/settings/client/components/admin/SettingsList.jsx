import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ActionButtons from 'app/modules/core/client/components/admin/ActionButtons';
import BooleanIcon from 'modules/core/client/components/admin/BooleanIcon';

class SettingsList extends React.Component {
  constructor(props) {
    super(props);
    this.settingsStore = props.settingsStore;
    this.openEditModal = props.openEditModal;
    this.handleDelete = props.handleDelete;
    this.handleCopy = props.handleCopy;
  }

  getCopyValue(item) {
    return item._id;
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th className="rs-hidden-xs">ID</th>
            <th>Name</th>
            <th>Enabled</th>
            <th className="action-buttons-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {this.settingsStore.items.map(item => (
            <tr key={item._id}>
              <td className="id rs-hidden-xs">{item._id}</td>
              <td>{item.name}</td>
              <td>
                <BooleanIcon value={item.enabled} />
              </td>
              <td>
                <ActionButtons
                  value={item._id}
                  onEdit={this.openEditModal}
                  onDelete={this.handleDelete}
                  copyValue={this.getCopyValue(item)}
                  onCopy={this.handleCopy}
                  copyTitle="Copy value"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

SettingsList.propTypes = {
  settingsStore: PropTypes.object.isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleCopy: PropTypes.func.isRequired,
};

const enhance = compose(inject('settingsStore'), observer);

export default enhance(SettingsList);
