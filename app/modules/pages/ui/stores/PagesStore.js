import { decorate, observable, action, runInAction } from 'mobx';
import axios from 'axios';

const { language = 'en' } = window.app.config;

const newPage = {
  id: null,
  title: '',
  url: '',
  body: '',
  template: '',
  language: language,
  background: '',
  meta: {},
  published: false,
};

class PagesStore {
  constructor() {
    this.page = Object.assign({}, newPage);
    this.url = null;
    this.pageNotFound = false;
  }

  load(url) {
    this.pageNotFound = false;
    this.url = url;
    return new Promise(resolve => {
      const opts = {
        params: { url },
      };
      axios
        .get('/api/pages', opts)
        .then(response => {
          runInAction(() => {
            const { data = {} } = response;
            this.page = data;
            resolve(data);
          });
        })
        .catch(e => {
          const { response } = e;
          if (response && response.status === 404) {
            runInAction(() => {
              this.page = Object.assign({}, newPage);
              this.pageNotFound = true;
            });
          }
        });
    });
  }

  resetPage() {
    this.pageNotFound = false;
    this.page = Object.assign({}, newPage);
  }
}

decorate(PagesStore, {
  page: observable,
  pageNotFound: observable,
  url: observable,
  load: action,
  resetPage: action,
});

export default new PagesStore();
