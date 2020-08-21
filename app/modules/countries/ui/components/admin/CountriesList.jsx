import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ActionButtons from 'app/modules/core/ui/components/admin/ActionButtons';
import BooleanIcon from 'modules/core/ui/components/admin/BooleanIcon';
import TableSortDnD from 'modules/core/ui/components/admin/TableSortDnD';

class CountriesList extends React.Component {
  constructor(props) {
    super(props);
    this.countriesAdminStore = props.countriesAdminStore;
    this.notificationsStore = props.notificationsStore;
    this.openEditModal = props.openEditModal;
    this.handleDelete = props.handleDelete;
    this.getRowCells = this.getRowCells.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  getTableHeader() {
    return (
      <thead>
        <tr>
          <th className="rs-hidden-sm">ID</th>
          <th>Image</th>
          <th>Name</th>
          <th>ISO</th>
          <th>Enabled</th>
          <th className="action-buttons-2">Actions</th>
        </tr>
      </thead>
    );
  }

  getRowCells(item) {
    return [
      <td key="id" className="id rs-hidden-sm">
        {item._id}
      </td>,
      <td key="image">
        <img src={item.imageUrl} style={{ height: '50px' }} />
      </td>,
      <td key="name" width="50%">
        {item.name}
      </td>,
      <td key="iso">{item.iso}</td>,
      <td key="enabled">
        <BooleanIcon value={item.enabled} />
      </td>,
      <td key="actions">
        <ActionButtons value={item._id} onEdit={this.openEditModal} onDelete={this.handleDelete} />
      </td>,
    ];
  }

  onDragEnd(result) {
    this.countriesAdminStore.reorderItems(result.source.index, result.destination.index).then(data => {
      if (data && data.success) {
        this.notificationsStore.push({
          title: 'Success',
          html: 'Sort order has been successfully saved',
          translate: true,
        });
      }
    });
  }

  render() {
    return (
      <TableSortDnD
        items={this.countriesAdminStore.items}
        idKey="_id"
        onDragEnd={this.onDragEnd}
        renderTableHead={this.getTableHeader}
        renderRowCells={this.getRowCells}
        applyDefaultDraggableStyle={true}
      />
    );
  }
}

CountriesList.propTypes = {
  countriesAdminStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

const enhance = compose(inject('countriesAdminStore', 'notificationsStore'), observer);

export default enhance(CountriesList);
