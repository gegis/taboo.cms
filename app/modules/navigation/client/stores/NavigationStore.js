import { decorate, observable, action, runInAction } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'modules/core/client/helpers/ResponseHelper';

class NavigationStore {
  constructor() {
    this.navigation = {};
  }

  // loadNavigationByName(name) {
  //   return new Promise(resolve => {
  //     axios
  //       .get('/api/navigation/:name'.replace(':name', name))
  //       .then(response => {
  //         runInAction(() => {
  //           const { data = {} } = response;
  //           if (data) {
  //             if (name === 'user') {
  //               this.userNavigation = data;
  //             } else {
  //               this.navigation = data;
  //             }
  //           }
  //           resolve(data);
  //         });
  //       })
  //       .catch(ResponseHelper.handleError);
  //   });
  // }

  loadByName(name, reload = false) {
    return new Promise(resolve => {
      if (this.navigation[name] && !reload) {
        resolve(this.navigation[name]);
      } else {
        axios
          .get('/api/navigation/:name'.replace(':name', name))
          .then(response => {
            runInAction(() => {
              const { data = {} } = response;
              this.navigation[name] = data;
              resolve(data);
            });
          })
          .catch(ResponseHelper.handleError);
      }
    });
  }
}

decorate(NavigationStore, {
  navigation: observable,
  userNavigation: observable,
  loadByName: action,
});

export default new NavigationStore();
