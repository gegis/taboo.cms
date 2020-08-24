import ConfigHelper from 'modules/core/ui/helpers/ConfigHelper';

class FormHelper {
  getTemplateComponent(name) {
    const { formComponents = {} } = ConfigHelper.getConfig();
    if (formComponents[name]) {
      return formComponents[name];
    }
    return null;
  }
}

export default new FormHelper();
