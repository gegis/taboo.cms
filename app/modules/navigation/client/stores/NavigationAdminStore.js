import { action, decorate, observable } from 'mobx';
import uuidv1 from 'uuid/v1';
import { removeNodeAtPath, changeNodeAtPath } from 'react-sortable-tree';
import AbstractAdminStore from 'modules/core/client/stores/AbstractAdminStore';

const newItem = {
  id: null,
  name: '',
  slug: '',
  items: [],
  language: 'en',
  enabled: false,
};

const newNavigationItem = {
  id: null,
  title: '',
  url: '',
  pageLink: '',
  openInNewPage: false,
  enabled: true,
};

class NavigationAdminStore extends AbstractAdminStore {
  constructor() {
    super({
      newItem: newItem,
      endpoints: {
        loadAll: {
          method: 'get',
          path: '/api/admin/navigation',
        },
        loadById: {
          method: 'get',
          path: '/api/admin/navigation/:id',
        },
        create: {
          method: 'post',
          path: '/api/admin/navigation',
        },
        update: {
          method: 'put',
          path: '/api/admin/navigation/:id',
        },
        deleteById: {
          method: 'delete',
          path: '/api/admin/navigation/:id',
        },
      },
    });
    this.navigationItem = Object.assign({}, newNavigationItem);
    this.navigationItemRow = {};
    this.resetNavigationItem = this.resetNavigationItem.bind(this);
    this.setNavigationItem = this.setNavigationItem.bind(this);
    this.setCheckboxNavigationItemValue = this.setCheckboxNavigationItemValue.bind(this);
    this.addNewNavigationItem = this.addNewNavigationItem.bind(this);
    this.updateNavigationItem = this.updateNavigationItem.bind(this);
    this.deleteNavigationItem = this.deleteNavigationItem.bind(this);
  }

  resetNavigationItem() {
    this.navigationItem = Object.assign({}, newNavigationItem);
    this.navigationItemRow = {};
  }

  setNavigationItem(item) {
    this.navigationItem = Object.assign(this.navigationItem, item);
  }

  setNavigationItemRow(row) {
    this.navigationItemRow = Object.assign(this.navigationItemRow, row);
  }

  setCheckboxNavigationItemValue(field, event, value) {
    this.navigationItem[field] = value;
  }

  addNewNavigationItem(navigationItem) {
    if (!navigationItem.id) {
      navigationItem.id = uuidv1();
    }
    if (this.item && this.item.items && Array.isArray(this.item.items)) {
      this.item.items.push(navigationItem);
    }
  }

  updateNavigationItem(navigationItem, navigationItemRow) {
    const { items = [] } = this.item;
    const newItems = changeNodeAtPath({
      treeData: items,
      path: navigationItemRow.path,
      newNode: navigationItem,
      getNodeKey: nodeRow => {
        const { node } = nodeRow;
        return node.id;
      },
      ignoreCollapsed: false,
    });
    this.setItem({ items: newItems });
  }

  deleteNavigationItem(navigationItemRow) {
    const { items = [] } = this.item;
    const newItems = removeNodeAtPath({
      treeData: items,
      path: navigationItemRow.path,
      getNodeKey: nodeRow => {
        const { node } = nodeRow;
        return node.id;
      },
      ignoreCollapsed: false,
    });
    this.setItem({ items: newItems });
  }
}

decorate(NavigationAdminStore, {
  item: observable,
  navigationItem: observable,
  navigationItemRow: observable,
  resetNavigationItem: action,
  setNavigationItem: action,
  setNavigationItemRow: action,
  setCheckboxNavigationItemValue: action,
  addNewNavigationItem: action,
  updateNavigationItem: action,
  deleteNavigationItem: action,
});

export default new NavigationAdminStore();
