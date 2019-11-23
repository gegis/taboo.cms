import { decorate, observable, action, runInAction } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'app/modules/core/client/helpers/ResponseHelper';

class AuthStore {
  constructor() {
    this.user = {};
    this.authenticated = false;
    this.admin = false;
    this.verified = true; // true - to avoid initial flashes
  }

  loginUser(email, password) {
    return new Promise((resolve, reject) => {
      axios
        .post('/api/login', { email, password })
        .then(response => {
          if (response && response.data) {
            const { data = {} } = response;
            runInAction(() => {
              if (data) {
                resolve(data);
              } else {
                reject(new Error('Login failed'));
              }
            });
          }
        })
        .catch(ResponseHelper.handleError);
    });
  }

  loadUserAuth() {
    return new Promise(resolve => {
      axios
        .get('/api/auth')
        .then(response => {
          runInAction(() => {
            const { data = {} } = response;
            if (data && data.id) {
              this.user = data;
              this.authenticated = true;
              this.admin = data.admin;
              this.verified = data.verified;
            } else {
              this.user = {};
              this.authenticated = false;
              this.verified = false;
            }
            resolve(this.user);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  setVerified(value) {
    this.verified = value;
  }
}

decorate(AuthStore, {
  user: observable,
  authenticated: observable,
  admin: observable,
  verified: observable,
  loadUserAuth: action,
  setVerified: action,
});

export default new AuthStore();
