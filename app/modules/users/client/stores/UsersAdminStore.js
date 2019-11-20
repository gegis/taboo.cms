import { decorate, observable, action, computed, runInAction } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'app/modules/core/client/helpers/ResponseHelper';
import ArrayHelper from 'app/modules/core/client/helpers/ArrayHelper';

const { userVerificationStatuses = [], userDocumentTypes = [] } = window.app.config;

const newUser = {
  id: null,
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  admin: false,
  active: false,
  verified: false,
  businessAccount: false,
  loginAttempts: 0,
  roles: [],
  companyName: '',
  street: '',
  city: '',
  state: '',
  country: '',
  postCode: '',
  phone: '',
  website: '',
  description: '',
  verificationStatus: 'new',
  verificationNote: '',
};

class UsersStore {
  constructor() {
    this.page = 1;
    this.limit = 50;
    this.search = '';
    this.hasMoreResults = false;
    this.users = [];
    this.sortBy = 'lastName';
    this.sortDirection = 'asc';
    this.user = Object.assign({}, newUser);
    this.allVerificationStatuses = [];
    userVerificationStatuses.map(item => {
      this.allVerificationStatuses.push({ label: item, value: item });
    });
    this.userDocumentTypes = userDocumentTypes;
    this.setUser = this.setUser.bind(this);
    this.toggleItemValue = this.toggleItemValue.bind(this);
    this.toggleUserDocumentVerified = this.toggleUserDocumentVerified.bind(this);
  }

  loadAll(options = {}) {
    return new Promise(resolve => {
      const opts = {
        params: {
          limit: this.limit,
        },
      };
      this.page = 1;
      this.hasMoreResults = false;
      this.search = '';
      if (options.search) {
        this.search = options.search;
        opts.params.search = options.search;
      }
      axios
        .get('/api/admin/users', opts)
        .then(response => {
          runInAction(() => {
            const { data = [] } = response;
            // this.users = ArrayHelper.sortByProperty(data, this.sortBy, this.sortDirection);
            this.hasMoreResults = data.length === this.limit;
            this.users = data;
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  loadNextPage() {
    return new Promise(resolve => {
      this.page++;
      const opts = {
        params: {
          page: this.page,
          limit: this.limit,
        },
      };
      if (this.search) {
        opts.params.search = this.search;
      }
      axios
        .get('/api/admin/users', opts)
        .then(response => {
          runInAction(() => {
            const { data = [] } = response;
            this.hasMoreResults = data.length === this.limit;
            this.users = this.users.concat(data);
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  loadOne(id) {
    return new Promise(resolve => {
      axios
        .get('/api/admin/users/' + id)
        .then(response => {
          runInAction(() => {
            const { data = {} } = response;
            if (!data.id && data._id) {
              data.id = data._id;
            }
            if (!data.verificationStatus) {
              data.verificationStatus = '';
            }
            data.password = '';
            this.user = Object.assign(this.user, data);
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  resetUser() {
    this.user = Object.assign({}, newUser);
  }

  setUser(user) {
    this.user = Object.assign(this.user, user);
  }

  toggleItemValue(field, event, value) {
    this.user[field] = value;
  }

  toggleUserDocumentVerified(docType, event, value) {
    axios
      .put('/api/admin/uploads/' + this.user[docType]._id, {
        verified: value,
      })
      .then(response => {
        const { data } = response;
        runInAction(() => {
          if (data) {
            this.user[docType].verified = value;
          }
        });
      })
      .catch(ResponseHelper.handleError);
  }

  sortUsers(field, direction) {
    this.sortBy = field;
    this.sortDirection = direction;
    this.users = ArrayHelper.sortByProperty([...this.users], this.sortBy, this.sortDirection);
  }

  getItemIndexById(id) {
    let index = null;
    this.users.find((item, i) => {
      if (item._id === id) {
        index = i;
      }
    });
    return index;
  }

  updateUser(data) {
    return new Promise(resolve => {
      axios
        .put('/api/admin/users/' + data.id, data)
        .then(response => {
          runInAction(() => {
            let index;
            if (response && response.data) {
              this.resetUser();
              index = this.getItemIndexById(response.data._id);
              if (index !== null) {
                this.users[index] = response.data;
              }
              resolve(response.data);
            }
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  deleteById(id) {
    return new Promise(resolve => {
      axios
        .delete(`/api/admin/users/${id}`)
        .then(response => {
          runInAction(() => {
            let index;
            if (response && response.data) {
              index = this.getItemIndexById(id);
              if (index !== null) {
                this.users.splice(index, 1);
              }
              resolve(response.data);
            }
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  get total() {
    return this.users.length;
  }
}

decorate(UsersStore, {
  userDocumentTypes: observable,
  allVerificationStatuses: observable,
  page: observable,
  limit: observable,
  hasMoreResults: observable,
  search: observable,
  users: observable,
  user: observable,
  loadAll: action,
  loadOne: action,
  setUser: action,
  resetUser: action,
  sortUsers: action,
  loadNextPage: action,
  updateUser: action,
  deleteById: action,
  toggleItemValue: action,
  toggleUserDocumentVerified: action,
  total: computed,
});

export default UsersStore;
