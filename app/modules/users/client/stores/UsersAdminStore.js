import { decorate, observable, action, runInAction } from 'mobx';
import axios from 'axios';
import AbstractAdminStore from 'app/modules/core/client/stores/AbstractAdminStore';
import ResponseHelper from 'app/modules/core/client/helpers/ResponseHelper';

const { userVerificationStatuses = [], userDocumentTypes = [] } = window.app.config;

const newItem = {
  id: '',
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
  apiKey: '',
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

    this.userDocumentTypes = userDocumentTypes;
    this.allVerificationStatuses = [];
    userVerificationStatuses.map(item => {
      this.allVerificationStatuses.push({ label: item, value: item });
    });
    this.toggleUserDocumentVerified = this.toggleUserDocumentVerified.bind(this);
  }

  loadById(id) {
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
            this.item = data;
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
}

decorate(UsersAdminStore, {
  userDocumentTypes: observable,
  allVerificationStatuses: observable,
  toggleUserDocumentVerified: action,
});

export default new UsersAdminStore();
