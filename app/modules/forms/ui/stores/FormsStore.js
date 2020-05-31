import { decorate, observable, action, runInAction } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'modules/core/ui/helpers/ResponseHelper';
import ContactUsTemplate from 'modules/forms/ui/components/formTemplates/ContactUsTemplate';

const formTemplates = {
  contactUs: {
    name: 'Contact Us',
    component: ContactUsTemplate,
  },
};

class FormsStore {
  constructor() {
    this.formTemplates = formTemplates;
    this.formsMap = {};
    this.formTemplateOptions = [];
    Object.keys(this.formTemplates).map(templateKey => {
      this.formTemplateOptions.push({
        label: this.formTemplates[templateKey].name,
        value: templateKey,
      });
    });
  }

  submit(formId, data, options = {}) {
    return new Promise(resolve => {
      axios
        .post(`/api/forms/${formId}`, data, options)
        .then(response => {
          runInAction(() => {
            const { data = {} } = response;
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  loadById(id) {
    return new Promise(resolve => {
      axios
        .get(`/api/forms/${id}`)
        .then(response => {
          runInAction(() => {
            const { data = {} } = response;
            if (data._id) {
              this.formsMap[data._id] = data;
            }
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }
}

decorate(FormsStore, {
  items: observable,
  formsMap: observable,
  submit: action,
  loadById: action,
});

export default new FormsStore();
