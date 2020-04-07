import { decorate, observable, action, runInAction } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'modules/core/client/helpers/ResponseHelper';

const { navigation = [], userNavigation = [] } = window.app.config;

class NavigationStore {
  constructor() {
    this.navigation = navigation;
    this.userNavigation = userNavigation;
  }

  loadNavigationBySlug(slug) {
    return new Promise(resolve => {
      axios
        .get('/api/navigation/:slug'.replace(':slug', slug))
        .then(response => {
          runInAction(() => {
            const { data = {} } = response;
            if (data) {
              if (slug === 'user') {
                this.userNavigation = data;
              } else {
                this.navigation = data;
              }
            }
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }
}

decorate(NavigationStore, {
  navigation: observable,
  userNavigation: observable,
  loadUserNavigation: action,
});

export default new NavigationStore();
