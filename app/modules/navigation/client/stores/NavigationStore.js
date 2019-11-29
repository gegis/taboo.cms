import { decorate, observable } from 'mobx';

const {navigation = [], userNavigation = []} = window.app.config;

class NavigationStore {
  constructor() {
    this.navigation = navigation;
    this.userNavigation = userNavigation;
  }
}

decorate(NavigationStore, {
  navigation: observable,
  userNavigation: observable,
});

export default new NavigationStore();
