import { decorate, observable, action, runInAction } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'modules/core/client/helpers/ResponseHelper';

const { navigation = [], userNavigation = [] } = window.app.config;

class NavigationStore {
  constructor() {
    this.navigation = navigation;
    this.userNavigation = userNavigation;
  }

  loadNavigationByType(type) {
    return new Promise(resolve => {
      axios
        .get('/api/navigation/:type'.replace(':type', type))
        .then(response => {
          runInAction(() => {
            const { data = {} } = response;
            if (data) {
              if (type === 'user') {
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
  loadUserNavigation: action,
  navigation: observable,
  userNavigation: observable,
});

export default new NavigationStore();
