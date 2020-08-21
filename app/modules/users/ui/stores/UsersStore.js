import { decorate, observable, action, runInAction } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'app/modules/core/ui/helpers/ResponseHelper';
import SocketsClient from 'modules/core/ui/helpers/SocketsClient';
import UsersHelper from 'modules/users/ui/helpers/UsersHelper';

const newSignupUser = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  country: '',
  agreeToAll: false,
  agreeToTerms: false,
};

const newUser = {
  active: false,
  admin: false,
  country: '',
  createdAt: '',
  email: '',
  firstName: '',
  lastName: '',
  loginAttempts: 0,
  newPassword: '',
  roles: [],
  updatedAt: '',
  verified: false,
  verificationStatus: '',
  verificationNote: '',
  profilePicture: {},
};

class UsersStore {
  constructor() {
    this.userAgreement = false;
    this.signupUser = Object.assign({}, newSignupUser);
    this.signupUserError = {};
    this.user = Object.assign({}, newUser);
    this.userError = {};
    this.setSignupUserData = this.setSignupUserData.bind(this);
    this.setSignupUserError = this.setSignupUserError.bind(this);
    this.setUserAgreement = this.setUserAgreement.bind(this);
    this.setSignupUserCheckboxValue = this.setSignupUserCheckboxValue.bind(this);
    this.resetSignupUser = this.setUserAgreement.bind(this);
    this.setUserData = this.setUserData.bind(this);
    this.setUserError = this.setUserError.bind(this);
    this.resetUser = this.resetUser.bind(this);
    this.getUserFormData = this.getUserFormData.bind(this);
  }

  loadUser() {
    return new Promise(resolve => {
      axios
        .get('/api/users/current')
        .then(response => {
          const { data = {} } = response;
          if (data.password) {
            delete data.password;
            data.newPassword = '';
          }
          runInAction(() => {
            this.user = Object.assign({}, this.user, data);
          });
          resolve(data);
        })
        .catch(ResponseHelper.handleError);
    });
  }

  saveUser(userData) {
    return new Promise(resolve => {
      axios
        .put('/api/users/current', userData)
        .then(response => {
          const { data = {} } = response;
          if (data.password) {
            delete data.password;
            data.newPassword = '';
          }

          runInAction(() => {
            this.user = Object.assign({}, this.user, data);
          });

          resolve(data);
        })
        .catch(ResponseHelper.handleError);
    });
  }

  registerUser() {
    return new Promise(resolve => {
      const data = Object.assign({}, this.signupUser, { userAgreement: this.userAgreement });
      axios
        .post('/api/users/register', data)
        .then(response => {
          const { data = {} } = response;
          resolve(data);
        })
        .catch(ResponseHelper.handleError);
    });
  }

  deactivateUser() {
    return new Promise(resolve => {
      axios
        .put('/api/users/deactivate')
        .then(response => {
          const { data = {} } = response;
          resolve(data);
        })
        .catch(ResponseHelper.handleError);
    });
  }

  resendVerification() {
    return new Promise(resolve => {
      axios
        .put('/api/users/resend-verification')
        .then(response => {
          const { data = {} } = response;
          resolve(data);
        })
        .catch(ResponseHelper.handleError);
    });
  }

  logoutUser(authStore) {
    return new Promise(resolve => {
      const userUpdateEvent = UsersHelper.getUserEventName('update', authStore);
      axios
        .get('/api/logout')
        .then(response => {
          const { data = {} } = response;
          SocketsClient.off(userUpdateEvent);
          SocketsClient.leave('users');
          resolve(data);
        })
        .catch(ResponseHelper.handleError);
    });
  }

  resetSignupUser() {
    this.userAgreement = false;
    this.signupUser = Object.assign({}, newSignupUser);
    this.signupUserError = {};
  }

  setSignupUserCheckboxValue(key, event, checked) {
    const data = {};
    data[key] = checked;
    if (key === 'agreeToAll') {
      data.agreeToTerms = checked;
    }
    this.signupUser = Object.assign({}, this.signupUser, data);
  }

  setSignupUserData(data) {
    this.signupUser = Object.assign({}, this.signupUser, data);
  }

  setSignupUserError(error) {
    this.signupUserError = Object.assign({}, error);
  }

  setUserData(data) {
    this.user = Object.assign({}, this.user, data);
  }

  setUserError(error) {
    this.userError = error;
  }

  resetUser() {
    this.user = Object.assign({}, newUser);
    this.userError = {};
  }

  setUserAgreement(value, checked) {
    this.userAgreement = checked;
  }

  /**
   * It's a workaround for rsuite Forms to update data on change
   */
  getUserFormData() {
    const data = {};
    Object.keys(this.user).map(key => {
      data[key] = this.user[key];
    });
    return data;
  }
}

decorate(UsersStore, {
  userAgreement: observable,
  signupUser: observable,
  signupUserError: observable,
  user: observable,
  userError: observable,
  setSignupUserData: action,
  setSignupUserError: action,
  setSignupUserCheckboxValue: action,
  setUserAgreement: action,
  registerUser: action,
  resetSignupUser: action,
  resetUser: action,
  setUserData: action,
  setUserError: action,
  loadUser: action,
  saveUser: action,
  getUserFormData: action,
  deleteUser: action,
});

export default new UsersStore();
