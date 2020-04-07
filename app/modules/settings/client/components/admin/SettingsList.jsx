import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ActionButtons from 'app/modules/core/client/components/admin/ActionButtons';
import BooleanIcon from 'modules/core/client/components/admin/BooleanIcon';
import Translation from 'modules/core/client/components/Translation';

class SettingsList extends React.Component {
  constructor(props) {
    super(props);
    this.settingsStore = props.settingsStore;
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
            <th className="rs-hidden-xs">Type</th>
            <th className="rs-hidden-xs">Value</th>
            <th className="rs-hidden-xs">Public</th>
            <th className="action-buttons-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {this.settingsStore.items.map(item => (
            <tr key={item._id}>
              <td>
                <div>{item.key}</div>
                <div className="rs-visible-xs">
                  <span className="subject md">
                    <Translation message="Type" />:
                  </span>{' '}
                  {item.type}
                </div>
                <div className="rs-visible-xs">
                  <span className="subject md">
                    <Translation message="Public" />:
                  </span>{' '}
                  <BooleanIcon value={item.public} />
                </div>
              </td>
              <td className="rs-hidden-xs">{item.type}</td>
              <td className="rs-hidden-xs">{item.value}</td>
              <td className="rs-hidden-xs">
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
  settingsStore: PropTypes.object.isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleCopy: PropTypes.func.isRequired,
};

const enhance = compose(inject('settingsStore'), observer);

export default enhance(SettingsList);
