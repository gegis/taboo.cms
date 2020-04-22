import { decorate, observable, action } from 'mobx';

class UIStore {
  constructor() {
    this.userSidebarOpen = false;
    this.loading = false;
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

decorate(UIStore, {
  userSidebarOpen: observable,
  loading: observable,
  toggleUserSidebar: action,
  openUserSidebar: action,
  closeUserSidebar: action,
  setLoading: action,
});

export default new UIStore();
