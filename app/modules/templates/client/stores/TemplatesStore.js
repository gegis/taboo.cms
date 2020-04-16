import { decorate, observable } from 'mobx';
import { templates } from 'app/modules/templates/client/tpl';

class TemplatesStore {
  constructor() {
    this.templates = templates;
  }
}

decorate(TemplatesStore, {
  templates: observable,
});

export default new TemplatesStore();
