import { decorate, observable, action, computed, runInAction } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'app/modules/core/client/helpers/ResponseHelper';
import ArrayHelper from 'app/modules/core/client/helpers/ArrayHelper';

const newPage = {
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

class PagesStore {
  constructor() {
    this._page = 1;
    this.limit = 50;
    this.hasMoreResults = false;
    this.search = '';
    this.pages = [];
    this.sortBy = 'title';
    this.sortDirection = 'asc';
    this.page = Object.assign({}, newPage);
    this.layoutOptions = [{ label: 'Default', value: 'default' }, { label: 'No Layout', value: 'no-layout' }];
    this.languageOptions = [{ label: 'English', value: 'en' }, { label: 'Spanish', value: 'es' }];
    this.richTextEditorVisible = false;
    this.setPage = this.setPage.bind(this);
  }

  loadAll(options = {}) {
    return new Promise(resolve => {
      const opts = {
        params: {
          limit: this.limit,
        },
      };
      this._page = 1;
      this.hasMoreResults = false;
      this.search = '';
      if (options.search) {
        this.search = options.search;
        opts.params.search = options.search;
      }
      axios
        .get('/api/admin/pages', opts)
        .then(response => {
          runInAction(() => {
            const { data = [] } = response;
            this.pages = data;
            this.hasMoreResults = data.length === this.limit;
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  loadNextPage() {
    return new Promise(resolve => {
      this._page++;
      const opts = {
        params: {
          page: this._page,
          limit: this.limit,
        },
      };
      if (this.search) {
        opts.params.search = this.search;
      }
      axios
        .get('/api/admin/pages', opts)
        .then(response => {
          runInAction(() => {
            const { data = [] } = response;
            this.hasMoreResults = data.length === this.limit;
            this.pages = this.pages.concat(data);
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  loadOne(id) {
    axios
      .get('/api/admin/pages/' + id)
      .then(response => {
        runInAction(() => {
          const { data = {} } = response;
          if (!data.id && data._id) {
            data.id = data._id;
          }
          if (data.published) {
            data.publishedGroup = ['published'];
          }
          if (!data.language) {
            data.language = newPage.language;
          }
          this.page = data;
        });
      })
      .catch(ResponseHelper.handleError);
  }

  resetPage() {
    this.page = Object.assign({}, newPage);
  }

  setPage(page) {
    // A workaround for published checkbox as FormControl needs CheckboxGroup, which comes as a array
    if (page.publishedGroup) {
      if (page.publishedGroup.indexOf('published') > -1) {
        page.published = true;
      } else {
        page.published = false;
      }
    }
    this.page = Object.assign(this.page, page);
  }

  sortPages(field, direction) {
    this.sortBy = field;
    this.sortDirection = direction;
    this.pages = ArrayHelper.sortByProperty([...this.pages], this.sortBy, this.sortDirection);
  }

  showRichTextEditor() {
    this.richTextEditorVisible = true;
  }

  hideRichTextEditor() {
    this.richTextEditorVisible = false;
  }

  getItemIndexById(id) {
    let index = null;
    this.pages.find((item, i) => {
      if (item._id === id) {
        index = i;
      }
    });
    return index;
  }

  updatePage(data) {
    return new Promise(resolve => {
      axios
        .put('/api/admin/pages/' + data.id, data)
        .then(response => {
          runInAction(() => {
            let index;
            if (response && response.data) {
              this.resetPage();
              index = this.getItemIndexById(response.data._id);
              if (index !== null) {
                this.pages[index] = response.data;
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
        .delete(`/api/admin/pages/${id}`)
        .then(response => {
          runInAction(() => {
            let index;
            if (response && response.data) {
              index = this.getItemIndexById(id);
              if (index !== null) {
                this.pages.splice(index, 1);
              }
              resolve(response.data);
            }
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  loadPreviousVersion() {
    return new Promise(resolve => {
      if (this.page && this.page.id) {
        axios
          .get('/api/admin/pages/previous/' + this.page.id)
          .then(response => {
            runInAction(() => {
              const { data = {} } = response;
              if (data && data._id) {
                if (!data.id && data._id) {
                  data.id = data._id;
                }
                if (data.published) {
                  data.publishedGroup = ['published'];
                }
                this.page = data;
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

  get total() {
    return this.pages.length;
  }
}

decorate(PagesStore, {
  _page: observable,
  limit: observable,
  hasMoreResults: observable,
  search: observable,
  pages: observable,
  page: observable,
  layoutOptions: observable,
  languageOptions: observable,
  richTextEditorVisible: observable,
  loadAll: action,
  loadOne: action,
  setPage: action,
  resetPage: action,
  sortPages: action,
  showRichTextEditor: action,
  hideRichTextEditor: action,
  loadNextPage: action,
  updatePage: action,
  deleteById: action,
  total: computed,
});

export default PagesStore;
