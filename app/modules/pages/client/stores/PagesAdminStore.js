import { decorate, observable, action, runInAction } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'app/modules/core/client/helpers/ResponseHelper';
import AbstractAdminStore from 'modules/core/client/stores/AbstractAdminStore';

const newItem = {
  id: null,
  title: '',
  url: '',
  body: '',
  layout: 'default',
  language: 'en',
  background: '',
  meta: {},
  published: false,
};

class PagesAdminStore extends AbstractAdminStore {
  constructor() {
    super({
      newItem: newItem,
      endpoints: {
        loadAll: {
          method: 'get',
          path: '/api/admin/pages',
        },
        loadById: {
          method: 'get',
          path: '/api/admin/pages/:id',
        },
        create: {
          method: 'post',
          path: '/api/admin/pages',
        },
        update: {
          method: 'put',
          path: '/api/admin/pages/:id',
        },
        deleteById: {
          method: 'delete',
          path: '/api/admin/pages/:id',
        },
      },
    });
    this.layoutOptions = [
      { label: 'Default', value: 'default' },
      { label: 'No Layout', value: 'no-layout' },
    ];
    this.richTextEditorVisible = false;
  }

  showRichTextEditor() {
    this.richTextEditorVisible = true;
  }

  hideRichTextEditor() {
    this.richTextEditorVisible = false;
  }

  loadPreviousVersion() {
    return new Promise(resolve => {
      if (this.item && this.item.id) {
        axios
          .get('/api/admin/pages/previous/' + this.item.id)
          .then(response => {
            runInAction(() => {
              const { data = {} } = response;
              if (data && data._id) {
                if (!data.id && data._id) {
                  data.id = data._id;
                }
                this.item = data;
              }
              resolve(data);
            });
          })
          .catch(ResponseHelper.handleError);
      } else {
        resolve(null);
      }
    });
  }
}

decorate(PagesAdminStore, {
  layoutOptions: observable,
  languageOptions: observable,
  richTextEditorVisible: observable,
  showRichTextEditor: action,
  hideRichTextEditor: action,
  loadPreviousVersion: action,
});

export default new PagesAdminStore();
