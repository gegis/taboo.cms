import { decorate, observable, action, runInAction } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'modules/core/ui/helpers/ResponseHelper';

class SettingsStore {
  constructor() {
    this.items = [];
  }

  loadAll() {
    return new Promise(resolve => {
      axios
        .get('/api/settings')
        .then(response => {
          runInAction(() => {
            const { data = {} } = response;
            this.items = data;
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }
}

decorate(SettingsStore, {
  items: observable,
  loadAll: action,
});

export default new SettingsStore();
