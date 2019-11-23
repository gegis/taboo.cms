import { decorate, observable, action, runInAction } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'app/modules/core/client/helpers/ResponseHelper';

const newSignupUser = {
  firstName: '',
  lastName: '',
  companyName: '',
  email: '',
  password: '',
  street: '',
  city: '',
  postCode: '',
  state: '',
  country: '',
  businessAccount: false,
};

const newUser = {
  active: false,
  admin: false,
  businessAccount: false,
  city: '',
  companyName: '',
  country: '',
  createdAt: '',
  description: '',
  email: '',
  firstName: '',
  lastName: '',
  loginAttempts: 0,
  newPassword: '',
  phone: '',
  postCode: '',
  roles: [],
  state: '',
  street: '',
  updatedAt: '',
  verified: false,
  verificationStatus: '',
  verificationNote: '',
  profilePicture: {},
  website: '',
};

class UsersStore {
  constructor() {
    this.accountType = 'personal'; // 'personal' || 'business'
    this.userAgreement = false;
    this.signupUser = Object.assign({}, newSignupUser);
    this.signupUserError = {};
    this.user = Object.assign({}, newUser);
    this.userError = {};
    this.setSignupUserData = this.setSignupUserData.bind(this);
    this.setSignupUserError = this.setSignupUserError.bind(this);
    this.setAccountType = this.setAccountType.bind(this);
    this.setUserAgreement = this.setUserAgreement.bind(this);
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
            this.user = Object.assign(this.user, data);
          });
          resolve(data);
        })
        .catch(ResponseHelper.handleError);
    });
  }

  saveUser() {
    return new Promise(resolve => {
      axios
        .put('/api/users/current', this.user)
        .then(response => {
          const { data = {} } = response;
          if (data.password) {
            delete data.password;
            data.newPassword = '';
          }

          runInAction(() => {
            this.user = Object.assign(this.user, data);
          });

          resolve(data);
        })
        .catch(ResponseHelper.handleError);
    });
  }

  registerUser() {
    return new Promise(resolve => {
      const data = Object.assign({}, this.signupUser, { userAgreement: this.userAgreement });
      if (this.accountType === 'business') {
        data.businessAccount = true;
      }
      axios
        .post('/api/users/register', data)
        .then(response => {
          const { data = {} } = response;
          resolve(data);
        })
        .catch(ResponseHelper.handleError);
    });
  }

  resetSignupUser() {
    this.accountType = 'personal'; // 'personal' || 'business'
    this.userAgreement = false;
    this.signupUser = Object.assign({}, newSignupUser);
    this.signupUserError = {};
  }

  setSignupUserData(data) {
    this.signupUser = Object.assign(this.signupUser, data);
  }

  setSignupUserError(error) {
    this.signupUserError = error;
  }

  setUserData(data) {
    this.user = Object.assign(this.user, data);
  }

  setUserError(error) {
    this.userError = error;
  }

  resetUser() {
    this.user = Object.assign({}, newUser);
    this.userError = {};
  }

  setAccountType(value) {
    this.accountType = value;
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
  accountType: observable,
  userAgreement: observable,
  signupUser: observable,
  signupUserError: observable,
  user: observable,
  userError: observable,
  setSignupUserData: action,
  setSignupUserError: action,
  setAccountType: action,
  setUserAgreement: action,
  registerUser: action,
  resetSignupUser: action,
  resetUser: action,
  setUserData: action,
  setUserError: action,
  loadUser: action,
  saveUser: action,
  getUserFormData: action,
});

export default new UsersStore();
