import { decorate, observable, action, runInAction } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'modules/core/client/helpers/ResponseHelper';

class CatsStore {
  constructor() {
    this.items = [];
  }

  loadAll() {
    return new Promise(resolve => {
      axios
        .get('/api/cats')
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

decorate(CatsStore, {
  items: observable,
  loadAll: action,
});

export default new CatsStore();
