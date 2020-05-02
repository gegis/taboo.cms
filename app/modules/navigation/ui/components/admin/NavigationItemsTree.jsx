import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import SortableTree from 'react-sortable-tree';
import { Icon, IconButton, Panel } from 'rsuite';

import ActionButtons from 'app/modules/core/ui/components/admin/ActionButtons';
import Translation from 'modules/core/ui/components/Translation';
import CreateNavigationItemModal from 'modules/navigation/ui/components/admin/CreateNavigationItemModal';
import EditNavigationItemModal from 'modules/navigation/ui/components/admin/EditNavigationItemModal';

class NavigationList extends React.Component {
  constructor(props) {
    super(props);
    this.navigationStore = props.navigationStore;
    this.createModal = React.createRef();
    this.editModal = React.createRef();
    this.onNavigationItemCreate = this.onNavigationItemCreate.bind(this);
    this.onNavigationItemEdit = this.onNavigationItemEdit.bind(this);
    this.onNavigationItemDelete = this.onNavigationItemDelete.bind(this);
    this.generateNodeProps = this.generateNodeProps.bind(this);
    this.onTreeChange = this.onTreeChange.bind(this);
  }

  onNavigationItemCreate() {
    const { current } = this.createModal;
    if (current) {
      current.open();
    }
  }

  onNavigationItemEdit(row) {
    const { current } = this.editModal;
    if (current) {
      current.open(row);
    }
  }

  onNavigationItemDelete(row) {
    const { deleteNavigationItem } = this.navigationStore;
    deleteNavigationItem(row);
  }

  getActionButtons(row) {
    const buttons = [];
    buttons.push(
      <ActionButtons
        value={row}
        onEdit={this.onNavigationItemEdit}
        onDelete={this.onNavigationItemDelete}
        btnClassName="rs-btn-xs"
      />
    );

    return buttons;
  }

  getNodeKey(item) {
    const { node } = item;
    return node.id;
  }

  generateNodeProps(row) {
    const { node } = row;
    let titleClassName = 'node-title';
    if (!node.enabled) {
      titleClassName += ' disabled';
    }
    return {
      title: <div className={titleClassName}>{node.title}</div>,
      subtitle: (
        <div>
          <a href={node.url} target="_blank" rel="noopener noreferrer">
            {node.url}
          </a>
        </div>
      ),
      buttons: this.getActionButtons(row),
    };
  }

  onTreeChange(items) {
    this.navigationStore.setItem({ items });
  }

  getNavigationItems() {
    const { item } = this.navigationStore;
    const navigationItems = [];
    let i;
    for (i = 0; i < item.items.length; i++) {
      navigationItems.push(item.items[i]);
    }
    return navigationItems;
  }

  render() {
    return (
      <div className="navigation-items-tree panel-wrapper">
        <div className="header">
          <div className="pull-left">
            <h5>
              <Translation message="Navigation Items" />
            </h5>
          </div>
          <div className="pull-right">
            <IconButton icon={<Icon icon="plus-square" />} appearance="primary" onClick={this.onNavigationItemCreate}>
              <Translation message="Add New Item" />
            </IconButton>
          </div>
          <div className="clearfix" />
        </div>
        <Panel bordered={true}>
          <div style={{ height: '100%' }}>
            <SortableTree
              isVirtualized={false}
              treeData={this.getNavigationItems()}
              rowHeight={44}
              scaffoldBlockPxWidth={36}
              getNodeKey={this.getNodeKey}
              generateNodeProps={this.generateNodeProps}
              onChange={this.onTreeChange}
            />
          </div>
        </Panel>
        <CreateNavigationItemModal ref={this.createModal} />
        <EditNavigationItemModal ref={this.editModal} />
      </div>
    );
  }
}

NavigationList.propTypes = {
  navigationStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('navigationStore'), observer);

export default enhance(NavigationList);
