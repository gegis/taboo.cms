import React from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Checkbox, InputPicker, HelpBlock, Panel } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Translation from 'app/modules/core/ui/components/Translation';
import RichTextEditor from 'modules/core/ui/components/RichTextEditor';
import PageBlockFrame from 'modules/pages/ui/components/admin/PageBlockFrame';

class FormForm extends React.Component {
  constructor(props) {
    super(props);
    this.formsAdminStore = props.formsAdminStore;
    this.formsStore = props.formsStore;
  }

  onCodeEditorChange(key, value) {
    const option = {};
    option[key] = value;
    this.formsAdminStore.setItem(option);
  }

  getTemplatePanelHeader() {
    const { formTemplateOptions } = this.formsStore;
    return (
      <div>
        <FormGroup controlId="template" className="inline">
          <span>Form Template</span> <FormControl name="template" data={formTemplateOptions} accepter={InputPicker} />
        </FormGroup>
      </div>
    );
  }

  getTemplate() {
    const { item = {} } = this.formsAdminStore;
    const { formTemplates = {} } = this.formsStore;
    let FormTemplate;
    if (item.template && formTemplates[item.template]) {
      FormTemplate = formTemplates[item.template].component;
      return (
        <PageBlockFrame style={{ height: '400px' }}>
          <div className="form-page-block-preview">
            <FormTemplate />
          </div>
        </PageBlockFrame>
      );
    }
    return null;
  }

  render() {
    const { setItem, item, setCheckboxItemValue } = this.formsAdminStore;
    return (
      <Form layout="horizontal" fluid onChange={setItem} formValue={item}>
        {item.id && (
          <FormGroup controlId="id" className="inline">
            <ControlLabel>
              <Translation message="ID" />
            </ControlLabel>
            <FormControl name="id" disabled />
          </FormGroup>
        )}
        {item.id && <div className="clearfix" />}
        <FormGroup controlId="title" className="inline">
          <ControlLabel>
            <Translation message="Title" />
          </ControlLabel>
          <FormControl name="title" />
        </FormGroup>
        <FormGroup controlId="enabled" className="inline">
          <ControlLabel>
            <Translation message="Enabled" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <Checkbox checked={item.enabled} onChange={setCheckboxItemValue.bind(null, 'enabled')} />
          </div>
        </FormGroup>
        <FormGroup controlId="recipients">
          <ControlLabel>
            <Translation message="Recipients" />
          </ControlLabel>
          <FormControl name="recipients" />
          <HelpBlock tooltip>Comma separated emails list</HelpBlock>
        </FormGroup>
        <Panel header="Form Header">
          <RichTextEditor onChange={this.onCodeEditorChange.bind(this, 'header')} value={item.header} height="200px" />
        </Panel>
        <Panel header={this.getTemplatePanelHeader()}>{this.getTemplate()}</Panel>
        <Panel header="Form Footer">
          <RichTextEditor onChange={this.onCodeEditorChange.bind(this, 'footer')} value={item.footer} height="200px" />
        </Panel>
      </Form>
    );
  }
}

FormForm.propTypes = {
  formsAdminStore: PropTypes.object.isRequired,
  formsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('formsAdminStore', 'formsStore'), observer);

export default enhance(FormForm);
