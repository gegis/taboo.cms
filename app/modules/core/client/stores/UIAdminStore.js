import { decorate, observable, action } from 'mobx';

const sidebarOpenKey = 'sidebar-open';

class UIAdminStore {
  constructor() {
    const openPref = window.localStorage.getItem(sidebarOpenKey) !== 'false';
    this.open = openPref;
    this.loading = false;
  }

  toggleAdminSidebar() {
    this.open = !this.open;
    window.localStorage.setItem(sidebarOpenKey, this.open);
  }

  openAdminSidebar() {
    this.open = true;
    window.localStorage.setItem(sidebarOpenKey, this.open);
  }

  closeAdminSidebar() {
    this.open = false;
    window.localStorage.setItem(sidebarOpenKey, this.open);
  }

  setLoading(value) {
    this.loading = value;
  }
}

decorate(UIAdminStore, {
  open: observable,
  loading: observable,
  toggleAdminSidebar: action,
  openAdminSidebar: action,
  closeAdminSidebar: action,
  setLoading: action,
});

export default new UIAdminStore();
