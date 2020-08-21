const FormModel = require('modules/forms/models/FormModel');

class FormsService {
  constructor() {
    this.beforeFormRender = this.beforeFormRender.bind(this);
  }

  async beforeFormRender(ctx, props) {
    const form = await FormModel.findOne({ enabled: true, _id: props.formId });
    if (form) {
      props.form = form;
      ctx.viewParams.metaTitle = form.title;
      ctx.viewParams.metaDescription = form.header;
    }
    return props;
  }
}

module.exports = new FormsService();
