import { decorate, observable, action, runInAction } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'app/modules/core/client/helpers/ResponseHelper';
import EntityAdminStore from 'modules/core/client/stores/EntityAdminStore';

const newItem = {
  id: null,
  name: '',
  url: '',
  path: '',
  size: '',
  type: '',
  isUserDocument: false,
  verified: false,
  note: '',
  user: '',
  documentType: '',
  createdAt: '',
  updatedAt: '',
};

class UploadsAdminStore  extends EntityAdminStore {
  constructor() {
    super({
      newItem: newItem,
      endpoints: {
        loadAll: {
          method: 'get',
          path: '/api/admin/uploads',
        },
        loadById: {
          method: 'get',
          path: '/api/admin/uploads/:id',
        },
        // create: {
        //   method: 'post',
        //   path: '/api/admin/uploads',
        // },
        update: {
          method: 'put',
          path: '/api/admin/uploads/:id',
        },
        deleteById: {
          method: 'delete',
          path: '/api/admin/uploads/:id',
        },
      },
    });
    this.itemsToUpload = [];
    this.typeOptions = [{ label: 'Image', value: 'image' }, { label: 'Video', value: 'video' }];
  }

  prependItemsToUpload(items) {
    const existing = this.itemsToUpload;
    if (items) {
      items.map(item => {
        item.status = 'toUpload';
      });
      this.itemsToUpload = items.concat(existing);
    }
  }

  resetItemsToUpload() {
    this.itemsToUpload = [];
  }

  uploadItems(next) {
    const items = this.itemsToUpload.slice();
    items.map(item => {
      let form = new window.FormData();
      if (item.status === 'toUpload') {
        item.status = 'uploading';
        this.itemsToUpload = items; // needed to force updates to view;
        form.append('file', item, item.name);
        axios
          .post('/api/admin/uploads', form, {
            headers: {
              'content-type': `multipart/form-data; boundary=${form._boundary}`,
            },
          })
          .then(data => {
            runInAction(() => {
              item.status = 'uploaded';
              this.itemsToUpload = items; // needed to force updates to view;
              if (next) {
                next(null, data.data);
              }
            });
          })
          .catch(e => {
            runInAction(() => {
              item.status = 'failed';
              this.itemsToUpload = items; // needed to force updates to view;
            });
            ResponseHelper.handleError(e);
          });
      }
    });
  }
}

decorate(UploadsAdminStore, {
  itemsToUpload: observable,
  typeOptions: observable,
  prependItemsToUpload: action,
  resetItemsToUpload: action,
  uploadItems: action,
});

export default UploadsAdminStore;
