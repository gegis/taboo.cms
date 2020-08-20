import { decorate, observable, action, runInAction } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'app/modules/core/ui/helpers/ResponseHelper';

const {
  config: {
    settings: {
      verifyEmailNotification = 'Please verify your email.',
      verifyDocsNotification = 'Please verify your account.',
    } = {},
  } = {},
} = window.app;

class AuthStore {
  constructor() {
    this.user = {};
    this.authenticated = null; // if null - means it is still loading
    this.admin = false;
    this.emailVerified = true; // true - to avoid initial flashes
    this.verified = true; // true - to avoid initial flashes
    this.verifyEmailNotification = verifyEmailNotification;
    this.verifyDocsNotification = verifyDocsNotification;
  }

  loginUser(email, password, rememberMe = false) {
    return new Promise((resolve, reject) => {
      axios
        .post('/api/login', { email, password, rememberMe })
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
              this.emailVerified = data.emailVerified;
            } else {
              this.user = {};
              this.authenticated = false;
              this.verified = false;
              this.emailVerified = false;
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
  verifyEmailNotification: observable,
  verifyDocsNotification: observable,
  loadUserAuth: action,
  setVerified: action,
});

export default new AuthStore();
