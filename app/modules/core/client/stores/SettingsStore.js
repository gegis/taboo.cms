import { decorate, observable, action } from 'mobx';

const sidebarOpenKey = 'sidebar-open';
const userMenuOpenKey = 'user-menu-open';

class SettingsStore {
  constructor() {
    const openPref = window.localStorage.getItem(sidebarOpenKey) !== 'false';
    const userMenuOpenPref = window.localStorage.getItem(sidebarOpenKey) !== 'false';
    this.open = openPref;
    this.userMenuOpen = userMenuOpenPref;
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

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
    window.localStorage.setItem(userMenuOpenKey, this.userMenuOpen);
  }

  openUserMenu() {
    this.userMenuOpen = true;
    window.localStorage.setItem(userMenuOpenKey, this.userMenuOpen);
  }

  closeUserMenu() {
    this.userMenuOpen = false;
    window.localStorage.setItem(userMenuOpenKey, this.userMenuOpen);
  }

  setLoading(value) {
    this.loading = value;
  }
}

decorate(SettingsStore, {
  open: observable,
  userMenuOpen: observable,
  loading: observable,
  toggleAdminSidebar: action,
  openAdminSidebar: action,
  closeAdminSidebar: action,
  toggleUserMenu: action,
  openUserMenu: action,
  closeUserMenu: action,
  setLoading: action,
});

export default SettingsStore;
