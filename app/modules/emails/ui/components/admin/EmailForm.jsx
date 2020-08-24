import React from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Panel, InputPicker } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Translation from 'app/modules/core/ui/components/Translation';
import RichTextEditor from 'modules/core/ui/components/admin/RichTextEditor';

class EmailForm extends React.Component {
  constructor(props) {
    super(props);
    this.emailsAdminStore = props.emailsAdminStore;
    this.notificationsStore = props.notificationsStore;
    this.localeStore = props.localeStore;
  }

  onCodeEditorChange(key, value) {
    const option = {};
    option[key] = value;
    this.emailsAdminStore.setItem(option);
  }

  copyVariableValue(value, event) {
    window.copyValueInput.value = value;
    window.copyValueInput.select();
    document.execCommand('copy');
    window.copyValueInput.blur();
    event.preventDefault();
    this.notificationsStore.push({
      title: 'Success',
      html: 'Successfully copied',
      translate: true,
    });
  }

  getActionVariables() {
    const { item, actions } = this.emailsAdminStore;
    const variables = [];
    if (item && item.action) {
      for (let i = 0; i < actions.length; i++) {
        if (item.action === actions[i].name && actions[i].variables) {
          actions[i].variables.map(variable => {
            variables.push(
              <span key={variable} style={{ marginRight: '15px' }}>
                <a href="#" title="Click to copy value" onClick={this.copyVariableValue.bind(this, variable)}>
                  {variable}
                </a>
              </span>
            );
          });
          break;
        }
      }
    }
    return variables;
  }

  render() {
    const { setItem, item } = this.emailsAdminStore;
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
        <FormGroup controlId="action" className="inline">
          <ControlLabel>
            <Translation message="Action" />
          </ControlLabel>
          <FormControl name="action" data={this.emailsAdminStore.actionsOptions} accepter={InputPicker} />
        </FormGroup>
        <FormGroup controlId="language" className="inline">
          <ControlLabel>
            <Translation message="Language" />
          </ControlLabel>
          <FormControl
            name="language"
            accepter={InputPicker}
            data={this.localeStore.languageOptions}
            cleanable={false}
          />
        </FormGroup>
        <FormGroup controlId="from" className="inline">
          <ControlLabel>
            <Translation message="From" />
          </ControlLabel>
          <FormControl name="from" />
        </FormGroup>
        <div className="clearfix" />
        <FormGroup controlId="subject">
          <ControlLabel>
            <Translation message="Subject" />
          </ControlLabel>
          <FormControl name="subject" />
        </FormGroup>
        <Panel header="Variables">{this.getActionVariables()}</Panel>
        <Panel header="Email Body">
          <RichTextEditor
            onChange={this.onCodeEditorChange.bind(this, 'body')}
            value={item.body}
            contentsCss={[]}
            height="360"
          />
        </Panel>
      </Form>
    );
  }
}

EmailForm.propTypes = {
  emailsAdminStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('emailsAdminStore', 'notificationsStore', 'localeStore'), observer);

export default enhance(EmailForm);
