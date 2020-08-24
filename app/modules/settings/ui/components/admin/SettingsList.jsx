import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ActionButtons from 'app/modules/core/ui/components/admin/ActionButtons';
import BooleanIcon from 'modules/core/ui/components/admin/BooleanIcon';
import Translation from 'modules/core/ui/components/Translation';

class SettingsList extends React.Component {
  constructor(props) {
    super(props);
    this.settingsAdminStore = props.settingsAdminStore;
    this.openEditModal = props.openEditModal;
    this.handleDelete = props.handleDelete;
    this.handleCopy = props.handleCopy;
  }

  getCopyValue(item) {
    return item.value;
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th className="rs-hidden-sm">Type</th>
            <th className="rs-hidden-sm">Value</th>
            <th className="rs-hidden-sm">Public</th>
            <th className="action-buttons-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {this.settingsAdminStore.items.map(item => (
            <tr key={item._id}>
              <td>
                <div>{item.key}</div>
                <div className="rs-visible-sm">
                  <span className="subject md">
                    <Translation message="Type" />:
                  </span>{' '}
                  {item.type}
                </div>
                <div className="rs-visible-sm">
                  <span className="subject md">
                    <Translation message="Public" />:
                  </span>{' '}
                  <BooleanIcon value={item.public} />
                </div>
              </td>
              <td className="rs-hidden-sm">{item.type}</td>
              <td className="rs-hidden-sm max-overflow">{item.value}</td>
              <td className="rs-hidden-sm">
                <BooleanIcon value={item.public} />
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
  settingsAdminStore: PropTypes.object.isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleCopy: PropTypes.func.isRequired,
};

const enhance = compose(inject('settingsAdminStore'), observer);

export default enhance(SettingsList);
