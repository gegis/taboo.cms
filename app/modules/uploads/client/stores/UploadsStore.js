import { decorate, observable, action, runInAction } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'app/modules/core/client/helpers/ResponseHelper';

class UploadsStore {
  constructor() {
    this.documentsToUpload = {
      documentPassport1: null,
      documentPassport2: null,
      documentIncorporation: null,
      profilePicture: null,
    };
  }

  uploadUserDocument(file, docName) {
    return new Promise(resolve => {
      if (file && docName) {
        this.documentsToUpload[docName] = file;
        this.documentsToUpload[docName].status = 'toUpload';
        this.uploadDocument(docName)
          .then(data => {
            resolve(data);
          })
          .catch(ResponseHelper.handleError);
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
              'user-document-type': docName,
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
              this.documentsToUpload[docName].status = 'failed';
            });
            ResponseHelper.handleError(e);
          });
      } else {
        reject('Nothing to upload');
      }
    });
  }
}

decorate(UploadsStore, {
  documentsToUpload: observable,
  uploadUserDocument: action,
  resetDocumentsToUpload: action,
  uploadDocument: action,
});

export default UploadsStore;
