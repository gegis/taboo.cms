import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ActionButtons from 'app/modules/core/client/components/admin/ActionButtons';
import BooleanIcon from 'modules/core/client/components/admin/BooleanIcon';

class BlocksList extends React.Component {
  constructor(props) {
    super(props);
    this.blocksStore = props.blocksStore;
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
            <th className="rs-hidden-sm">ID</th>
            <th>Name</th>
            <th>Language</th>
            <th>Enabled</th>
            <th className="action-buttons-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {this.blocksStore.items.map(item => (
            <tr key={item._id}>
              <td className="id rs-hidden-sm">{item._id}</td>
              <td>{item.name}</td>
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

BlocksList.propTypes = {
  blocksStore: PropTypes.object.isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleCopy: PropTypes.func.isRequired,
};

const enhance = compose(inject('blocksStore'), observer);

export default enhance(BlocksList);
