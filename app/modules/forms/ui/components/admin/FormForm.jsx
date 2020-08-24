import React from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Checkbox, InputPicker, HelpBlock, Panel, Input } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Translation from 'app/modules/core/ui/components/Translation';
import RichTextEditor from 'modules/core/ui/components/admin/RichTextEditor';
import PageBlockFrame from 'modules/pages/ui/components/admin/PageBlockFrame';
import FormHelper from 'modules/forms/ui/helpers/FormHelper';

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
    const Component = FormHelper.getTemplateComponent(item.template);
    if (item.template && formTemplates[item.template] && Component) {
      return (
        <PageBlockFrame style={{ height: '400px' }}>
          <div className={`form-page-block-preview form-${item.template}`}>
            <Component />
          </div>
        </PageBlockFrame>
      );
    }

    return null;
  }

  updateConditionalRecipients(index, formField, fieldValue, recipients) {
    this.formsAdminStore.setConditionalRecipients(index, formField, fieldValue, recipients);
  }

  getConditionalRecipientValue(index) {
    const { item = {} } = this.formsAdminStore;
    if (item.conditionalRecipients && item.conditionalRecipients[index]) {
      return item.conditionalRecipients[index].recipients;
    }
    return '';
  }

  getConditionalRecipients() {
    const { item = {} } = this.formsAdminStore;
    const { formTemplates } = this.formsStore;
    const recipients = [];
    if (item.template && formTemplates[item.template] && formTemplates[item.template].conditionalRecipients) {
      formTemplates[item.template].conditionalRecipients.map((recipient, index) => {
        if (!item.conditionalRecipients || !item.conditionalRecipients[index]) {
          this.formsAdminStore.setConditionalRecipients(index, recipient.formField, recipient.fieldValue, '');
        }
        recipients.push(
          <FormGroup controlId="conditionalRecipients" key={index}>
            <ControlLabel>
              {recipient.formField} = {recipient.fieldValue}
            </ControlLabel>
            <div className="rs-form-control-wrapper">
              <Input
                value={this.getConditionalRecipientValue(index)}
                onChange={this.updateConditionalRecipients.bind(this, index, recipient.formField, recipient.fieldValue)}
              />
            </div>
          </FormGroup>
        );
      });
    }
    return recipients;
  }

  hasConditionalRecipients() {
    const { item = {} } = this.formsAdminStore;
    const { formTemplates } = this.formsStore;
    return item.template && formTemplates[item.template] && formTemplates[item.template].conditionalRecipients;
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
        {this.hasConditionalRecipients() && (
          <Panel header="Conditional Recipients">
            {this.getConditionalRecipients()}
            <HelpBlock>If a conditional requirement is met - it will use the matching recipients list</HelpBlock>
          </Panel>
        )}
        <Panel header="Form Header">
          <RichTextEditor onChange={this.onCodeEditorChange.bind(this, 'header')} value={item.header} height="200" />
        </Panel>
        <Panel header={this.getTemplatePanelHeader()}>{this.getTemplate()}</Panel>
        <Panel header="Form Footer">
          <RichTextEditor onChange={this.onCodeEditorChange.bind(this, 'footer')} value={item.footer} height="200" />
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
