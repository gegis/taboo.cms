import { decorate, observable, action, runInAction } from 'mobx';
import axios from 'axios';
import AbstractAdminStore from 'app/modules/core/ui/stores/AbstractAdminStore';
import ResponseHelper from 'app/modules/core/ui/helpers/ResponseHelper';

const { userVerificationStatuses = [], userDocumentNames = [] } = window.app.config;

const newItem = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  admin: false,
  active: false,
  verified: false,
  emailVerified: false,
  loginAttempts: 0,
  roles: [],
  country: '',
  verificationStatus: 'new',
  verificationNote: '',
  agreeToTerms: false,
  // exported: false,
};

class UsersAdminStore extends AbstractAdminStore {
  constructor() {
    super({
      newItem: newItem,
      endpoints: {
        loadAll: {
          method: 'get',
          path: '/api/admin/users',
        },
        loadById: {
          method: 'get',
          path: '/api/admin/users/:id',
        },
        create: {
          method: 'post',
          path: '/api/admin/users',
        },
        update: {
          method: 'put',
          path: '/api/admin/users/:id',
        },
        deleteById: {
          method: 'delete',
          path: '/api/admin/users/:id',
        },
      },
    });
    this.userDocumentNames = userDocumentNames;
    this.allVerificationStatuses = [];
    userVerificationStatuses.map(item => {
      this.allVerificationStatuses.push({ label: item, value: item });
    });
    this.selected = [];
    this.userApiKeys = [];
    this.toggleUserDocumentVerified = this.toggleUserDocumentVerified.bind(this);
    this.updateSelectedUsersFields = this.updateSelectedUsersFields.bind(this);
  }

  setSelected(data) {
    this.selected = data;
  }

  setUserApiKeys(data) {
    this.userApiKeys = data;
  }

  resetUserApiKeys() {
    this.userApiKeys = [];
  }

  loadById(id) {
    return new Promise(resolve => {
      axios
        .get(`/api/admin/users/${id}`)
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
            this.item = data;
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  createApiKey(userId) {
    return new Promise(resolve => {
      axios
        .post(`/api/admin/users/${userId}/api-keys`)
        .then(response => {
          const { data = [] } = response;
          resolve(data);
        })
        .catch(ResponseHelper.handleError);
    });
  }

  loadApiKeysByUserId(userId) {
    return new Promise(resolve => {
      axios
        .get(`/api/admin/users/${userId}/api-keys`)
        .then(response => {
          runInAction(() => {
            const { data = [] } = response;
            if (data) {
              this.setUserApiKeys(data);
            }
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  renewUserApiKey(userId, apiKeyId) {
    return new Promise(resolve => {
      axios
        .put(`/api/admin/users/${userId}/api-keys/${apiKeyId}/renew`)
        .then(response => {
          const { data = [] } = response;
          resolve(data);
        })
        .catch(ResponseHelper.handleError);
    });
  }

  deleteUserApiKey(userId, apiKeyId) {
    return new Promise(resolve => {
      axios
        .delete(`/api/admin/users/${userId}/api-keys/${apiKeyId}`)
        .then(response => {
          const { data = [] } = response;
          resolve(data);
        })
        .catch(ResponseHelper.handleError);
    });
  }

  updateSelectedUsersFields(field, value) {
    return new Promise(resolve => {
      const opts = {
        field: field,
        value: value,
        users: this.selected,
      };
      axios
        .put('/admin/users/set-field-value-for-ids', opts)
        .then(response => {
          runInAction(() => {
            const { data } = response;
            let items = this.items;
            for (let i = 0; i < data.length; i++) {
              let index = this.getItemIndexById(data[i]._id);
              if (index !== null) {
                items[index] = data[i];
                this.setItems(items);
              }
            }
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  toggleUserDocumentVerified(docType, event, value) {
    return new Promise(resolve => {
      axios
        .put('/api/admin/uploads/' + this.item[docType]._id, {
          verified: value,
        })
        .then(response => {
          runInAction(() => {
            const { data } = response;
            if (data) {
              this.item[docType].verified = value;
            }
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  resendAccountVerification(userId) {
    return new Promise(resolve => {
      axios
        .get(`/api/admin/user/${userId}/resend-verify-email`)
        .then(response => {
          runInAction(() => {
            const { data } = response;
            if (data && data.success) {
              super.setItem({
                accountVerificationCode: data.accountVerificationCode,
                accountVerificationCodeRequested: data.accountVerificationCodeRequested,
              });
            }
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }
}

decorate(UsersAdminStore, {
  userApiKeys: observable,
  userDocumentNames: observable,
  allVerificationStatuses: observable,
  toggleUserDocumentVerified: action,
  updateSelectedUsersFields: action,
  setUserApiKeys: action,
  resetUserApiKeys: action,
  loadApiKeysByUserId: action,
});

export default new UsersAdminStore();
