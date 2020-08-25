import { decorate, observable, action, runInAction } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'modules/core/ui/helpers/ResponseHelper';

class ModuleNameStore {
  constructor() {
    this.items = [];
  }

  loadAll() {
    return new Promise(resolve => {
      axios
        .get('/api/moduleName')
        .then(response => {
          runInAction(() => {
            const { data: { items = [] } = {} } = response;
            this.items = items;
            resolve(response.data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }
}

decorate(ModuleNameStore, {
  items: observable,
  loadAll: action,
});

export default new ModuleNameStore();
