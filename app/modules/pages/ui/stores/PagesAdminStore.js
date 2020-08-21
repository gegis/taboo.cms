import { decorate, observable, action, runInAction } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'app/modules/core/ui/helpers/ResponseHelper';
import AbstractAdminStore from 'modules/core/ui/stores/AbstractAdminStore';

const { language = 'en', templates: { defaultTemplate = 'standard' } = {} } = window.app.config;

const newItem = {
  id: null,
  title: '',
  url: '',
  blocks: [
    {
      name: 'HTML',
      props: {
        html: '<div class="rs-grid-container"><section class="section light"></section></div>',
      },
      template: {
        path: '/modules/pages/views/htmlPageBlock',
      },
    },
  ],
  template: defaultTemplate,
  background: '',
  headerBackground: '',
  fullWidth: false,
  language: language,
  meta: {},
  published: true,
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
    this.richTextEditorVisible = false;
  }

  addBlock(block) {
    if (!this.item.blocks) {
      this.item.blocks = [];
    }
    this.item.blocks.push({
      name: block.name,
      props: block.props,
      template: block.template,
    });
  }

  setBlockProps(index, props) {
    if (this.item.blocks[index]) {
      this.item.blocks[index].props = Object.assign(this.item.blocks[index].props, props);
    }
  }

  deleteBlock(index) {
    if (this.item.blocks[index]) {
      this.item.blocks.splice(index, 1);
    }
  }

  reorderBlocks(startIndex, endIndex) {
    const [removed] = this.item.blocks.splice(startIndex, 1);
    this.item.blocks.splice(endIndex, 0, removed);
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
  richTextEditorVisible: observable,
  showRichTextEditor: action,
  hideRichTextEditor: action,
  loadPreviousVersion: action,
  addBlock: action,
  deleteBlock: action,
  reorderBlocks: action,
  setBlockProps: action,
});

export default new PagesAdminStore();
