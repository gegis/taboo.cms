import { decorate, action, observable, runInAction } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'modules/core/ui/helpers/ResponseHelper';

class GalleriesStore {
  constructor() {
    this.galleries = {};
  }

  loadById(id) {
    return new Promise(resolve => {
      axios
        .get(`/api/galleries/${id}`)
        .then(response => {
          runInAction(() => {
            const { data = {} } = response;
            if (data._id) {
              this.setGallery(data);
            }
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  setGallery(gallery) {
    this.galleries[gallery._id] = gallery;
  }
}

decorate(GalleriesStore, {
  galleries: observable,
  loadById: action,
});

export default new GalleriesStore();
