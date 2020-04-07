import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ActionButtons from 'app/modules/core/client/components/admin/ActionButtons';
import BooleanIcon from 'modules/core/client/components/admin/BooleanIcon';

class NavigationList extends React.Component {
  constructor(props) {
    super(props);
    this.navigationStore = props.navigationStore;
    this.openEditModal = props.openEditModal;
    this.handleDelete = props.handleDelete;
    this.handleCopy = props.handleCopy;
  }

  getCopyValue(item) {
    return item.slug;
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Language</th>
            <th>Enabled</th>
            <th className="action-buttons-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {this.navigationStore.items.map(item => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.slug}</td>
              <td>{item.language}</td>
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

NavigationList.propTypes = {
  navigationStore: PropTypes.object.isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleCopy: PropTypes.func.isRequired,
};

const enhance = compose(inject('navigationStore'), observer);

export default enhance(NavigationList);
