import { decorate, observable, action } from 'mobx';

const sidebarOpenKey = 'sidebar-open';

class UIAdminStore {
  constructor() {
    const openPref = window.localStorage.getItem(sidebarOpenKey) !== 'false';
    this.sidebarOpen = openPref;
    this.expandedSidebarItems = [];
    this.loading = false;
  }

  toggleAdminSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    window.localStorage.setItem(sidebarOpenKey, this.sidebarOpen);
  }

  openAdminSidebar() {
    this.sidebarOpen = true;
    window.localStorage.setItem(sidebarOpenKey, this.sidebarOpen);
  }

  closeAdminSidebar() {
    this.sidebarOpen = false;
    window.localStorage.setItem(sidebarOpenKey, this.sidebarOpen);
  }

  setExpandedSidebarItems(itemKeys) {
    this.expandedSidebarItems = itemKeys;
  }

  setLoading(value) {
    this.loading = value;
  }
}

decorate(UIAdminStore, {
  sidebarOpen: observable,
  loading: observable,
  expandedSidebarItems: observable,
  toggleAdminSidebar: action,
  openAdminSidebar: action,
  closeAdminSidebar: action,
  setExpandedSidebarItems: action,
  setLoading: action,
});

export default new UIAdminStore();
