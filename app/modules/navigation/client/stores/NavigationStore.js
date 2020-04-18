import { decorate, observable, action, runInAction } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'modules/core/client/helpers/ResponseHelper';

class NavigationStore {
  constructor() {
    this.navigation = {};
    this.loading = [];
  }

  loadByName(name, reload = false) {
    if (name && !this.isLoading(name) && (!this.navigation[name] || reload)) {
      this.addToLoading(name);
      axios
        .get('/api/navigation/:name'.replace(':name', name))
        .then(response => {
          this.removeFromLoading(name);
          runInAction(() => {
            const { data = {} } = response;
            this.navigation[name] = data;
          });
        })
        .catch(err => {
          this.removeFromLoading(name);
          ResponseHelper.handleError(err);
        });
    }
  }

  isLoading(name) {
    return this.loading.indexOf(name) !== -1;
  }

  addToLoading(name) {
    if (this.loading.indexOf(name) === -1) {
      this.loading.push(name);
    }
  }

  removeFromLoading(name) {
    const index = this.loading.indexOf(name);
    if (index !== -1) {
      this.loading.splice(index, 1);
    }
  }
}

decorate(NavigationStore, {
  navigation: observable,
  userNavigation: observable,
  loadByName: action,
});

export default new NavigationStore();
