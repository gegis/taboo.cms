import { decorate, observable, action, runInAction } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'app/modules/core/ui/helpers/ResponseHelper';
import AbstractAdminStore from 'modules/core/ui/stores/AbstractAdminStore';

const newItem = {
  id: null,
  name: '',
  url: '',
  path: '',
  size: '',
  type: '',
  isPrivate: false,
  isUserFile: false,
  verified: false,
  note: '',
  user: '',
  documentName: '',
  createdAt: '',
  updatedAt: '',
};

class UploadsAdminStore extends AbstractAdminStore {
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
    this.typeOptions = [
      { label: 'Image', value: 'image' },
      { label: 'Video', value: 'video' },
    ];
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

export default new UploadsAdminStore();
