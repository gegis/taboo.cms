import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import SortableTree from 'react-sortable-tree';

import ActionButtons from 'app/modules/core/client/components/admin/ActionButtons';

class NavigationList extends React.Component {
  constructor(props) {
    super(props);
    this.navigationStore = props.navigationStore;
    this.notificationsStore = props.notificationsStore;
    this.openEditModal = props.openEditModal;
    this.handleDelete = props.handleDelete;
    this.handleCopy = props.handleCopy;
    this.generateNodeProps = this.generateNodeProps.bind(this);
    this.onTreeChange = this.onTreeChange.bind(this);
  }

  getActionButtons(node) {
    const buttons = [];
    buttons.push(
      <ActionButtons
        value={node._id}
        onEdit={this.openEditModal}
        onDelete={this.handleDelete}
        btnClassName="rs-btn-sm"
      />
    );

    return buttons;
  }

  generateNodeProps({ node }) {
    return {
      title: <span>{node.title}</span>,
      subtitle: <span>{node._id}</span>,
      buttons: this.getActionButtons(node),
    };
  }

  onTreeChange(items) {
    this.navigationStore.setItems(items);
  }

  render() {
    const { items } = this.navigationStore;
    return (
      <div style={{ height: '100%' }}>
        <SortableTree
          isVirtualized={false}
          treeData={items}
          generateNodeProps={this.generateNodeProps}
          onChange={this.onTreeChange}
        />
      </div>
    );
  }
}

NavigationList.propTypes = {
  navigationStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleCopy: PropTypes.func.isRequired,
};

const enhance = compose(inject('navigationStore', 'notificationsStore'), observer);

export default enhance(NavigationList);
