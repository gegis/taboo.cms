import AbstractAdminStore from 'modules/core/ui/stores/AbstractAdminStore';
import { decorate, observable, action, runInAction } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'modules/core/ui/helpers/ResponseHelper';

const newItem = {
  id: '',
  title: '',
  recipients: '',
  header: '<div class="form-page-block-preview">Header</div>',
  footer: '<div class="form-page-block-preview">Footer</div>',
  template: '',
  enabled: false,
};

class FormsAdminStore extends AbstractAdminStore {
  constructor() {
    super({
      newItem: newItem,
      endpoints: {
        loadAll: {
          method: 'get',
          path: '/api/admin/forms',
        },
        loadById: {
          method: 'get',
          path: '/api/admin/forms/:id',
        },
        create: {
          method: 'post',
          path: '/api/admin/forms',
        },
        update: {
          method: 'put',
          path: '/api/admin/forms/:id',
        },
        deleteById: {
          method: 'delete',
          path: '/api/admin/forms/:id',
        },
      },
    });
    this.formOptions = [];
    this.entries = [];
  }

  setItems(items) {
    super.setItems(items);
    this.formOptions = [];
    items.map(item => {
      this.formOptions.push({
        label: item.title,
        value: item._id,
      });
    });
  }

  resetEntries() {
    this.entries = [];
  }

  loadEntries(formId) {
    return new Promise(resolve => {
      axios
        .get(`/api/admin/forms/entries/${formId}`)
        .then(response => {
          runInAction(() => {
            const { data = [] } = response;
            this.entries = data;
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }
}

decorate(FormsAdminStore, {
  formOptions: observable,
  entries: observable,
  setItems: action,
  resetEntries: action,
  loadEntries: action,
});

export default new FormsAdminStore();
