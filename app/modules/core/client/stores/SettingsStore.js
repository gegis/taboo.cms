import { decorate, observable, action } from 'mobx';

const sidebarOpenKey = 'sidebar-open';

class SettingsStore {
  constructor() {
    const openPref = window.localStorage.getItem(sidebarOpenKey) !== 'false';
    this.open = openPref;
    this.userSidebarOpen = false;
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

  toggleUserSidebar() {
    this.userSidebarOpen = !this.userSidebarOpen;
  }

  openUserSidebar() {
    this.userSidebarOpen = true;
  }

  closeUserSidebar() {
    this.userSidebarOpen = false;
  }

  setLoading(value) {
    this.loading = value;
  }
}

decorate(SettingsStore, {
  open: observable,
  userSidebarOpen: observable,
  loading: observable,
  toggleAdminSidebar: action,
  openAdminSidebar: action,
  closeAdminSidebar: action,
  toggleUserSidebar: action,
  openUserSidebar: action,
  closeUserSidebar: action,
  setLoading: action,
});

export default new SettingsStore();
