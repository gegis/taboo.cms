import { decorate, observable, action, runInAction } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'app/modules/core/ui/helpers/ResponseHelper';

class UploadsStore {
  constructor() {
    this.documentsToUpload = {
      documentPersonal1: null,
      documentPersonal2: null,
      documentIncorporation: null,
      profilePicture: null,
    };
    this.page = 1;
    this.limit = 12;
    this.hasMoreResults = false;
    this.filter = null;
    this.search = '';
    this.populate = '';
    this.items = [];
    this.uploading = false;
    this.sortBy = 'createdAt';
    this.sortDirection = 'desc';
    this.setItems = this.setItems.bind(this);
  }

  uploadUserDocument(file, docName) {
    this.uploading = true;
    return new Promise(resolve => {
      if (file && docName) {
        this.documentsToUpload[docName] = file;
        this.documentsToUpload[docName].status = 'toUpload';
        this.uploadDocument(docName)
          .then(data => {
            runInAction(() => {
              this.uploading = false;
            });
            resolve(data);
          })
          .catch(e => {
            runInAction(() => {
              this.uploading = false;
            });
            ResponseHelper.handleError(e);
          });
      }
    });
  }

  resetDocumentsToUpload() {
    this.documentsToUpload = {};
  }

  uploadDocument(docName) {
    return new Promise((resolve, reject) => {
      let form = new window.FormData();
      if (this.documentsToUpload[docName] && this.documentsToUpload[docName].status === 'toUpload') {
        this.documentsToUpload[docName].status = 'uploading';
        form.append('file', this.documentsToUpload[docName], this.documentsToUpload[docName].name);
        axios
          .post('/api/uploads/files', form, {
            headers: {
              'content-type': `multipart/form-data; boundary=${form._boundary}`,
              'document-name': docName,
            },
          })
          .then(response => {
            const { data = null } = response;
            runInAction(() => {
              this.documentsToUpload[docName].status = 'uploaded';
            });
            resolve(data);
          })
          .catch(e => {
            runInAction(() => {
              this.uploading = false;
              this.documentsToUpload[docName].status = 'failed';
            });
            ResponseHelper.handleError(e);
          });
      } else {
        reject('Nothing to upload');
      }
    });
  }

  setItems(items) {
    this.items = items;
  }

  setFilter(filter) {
    this.filter = filter;
  }

  setSearch(search) {
    this.search = search;
  }

  setPopulate(populate) {
    this.populate = populate;
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
      if (options.search) {
        this.setSearch(options.search);
        opts.params.search = options.search;
      } else {
        this.setSearch('');
      }
      if (options.populate) {
        this.setPopulate(options.populate);
        opts.params.populate = options.populate;
      }
      if (options.filter) {
        this.setFilter(options.filter);
        opts.params.filter = options.filter;
      } else if (this.filter) {
        opts.params.filter = this.filter;
      }
      axios
        .get('/api/uploads', opts)
        .then(response => {
          runInAction(() => {
            const { data = [] } = response;
            this.setItems(data);
            this.hasMoreResults = data.length === this.limit;
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
      if (this.populate) {
        opts.params.populate = this.populate;
      }
      if (this.filter) {
        opts.params.filter = this.filter;
      }
      axios
        .get('/api/uploads', opts)
        .then(response => {
          runInAction(() => {
            const { data = [] } = response;
            this.hasMoreResults = data.length === this.limit;
            this.setItems(this.items.concat(data));
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }
}

decorate(UploadsStore, {
  documentsToUpload: observable,
  page: observable,
  limit: observable,
  hasMoreResults: observable,
  filter: observable,
  search: observable,
  populate: observable,
  items: observable,
  uploading: observable,
  setItems: action,
  setFilter: action,
  setSearch: action,
  setPopulate: action,
  loadAll: action,
  loadNextPage: action,
  uploadUserDocument: action,
  resetDocumentsToUpload: action,
  uploadDocument: action,
});

export default new UploadsStore();
