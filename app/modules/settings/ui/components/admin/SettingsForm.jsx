import React from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Checkbox, SelectPicker } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Translation from 'app/modules/core/ui/components/Translation';
import CodeEditor from 'modules/core/ui/components/CodeEditor';

class SettingsForm extends React.Component {
  constructor(props) {
    super(props);
    this.settingsAdminStore = props.settingsAdminStore;
    this.onCodeEditorChange = this.onCodeEditorChange.bind(this);
  }

  onCodeEditorChange(editorValue) {
    this.settingsAdminStore.setItem({ originalValue: editorValue });
  }

  getValueInput() {
    const {
      item,
      setCheckboxItemValue,
      item: { type = '' },
    } = this.settingsAdminStore;
    let element = <FormControl name="value" />;

    if (type === 'json') {
      element = (
        <CodeEditor
          mode="json"
          onChange={this.onCodeEditorChange}
          value={item.originalValue}
          width="auto"
          height="200px"
          className="code-editor"
        />
      );
    } else if (type === 'boolean') {
      element = (
        <div className="rs-form-control-wrapper">
          <Checkbox checked={item.booleanValue} onChange={setCheckboxItemValue.bind(null, 'booleanValue')} />
        </div>
      );
    }

    return element;
  }

  render() {
    const { setItem, item, setCheckboxItemValue } = this.settingsAdminStore;
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
        <FormGroup controlId="key" className="inline">
          <ControlLabel>
            <Translation message="Key" />
          </ControlLabel>
          <FormControl name="key" />
        </FormGroup>
        <FormGroup controlId="type" className="inline">
          <ControlLabel>
            <Translation message="Type" />
          </ControlLabel>
          <FormControl name="type" accepter={SelectPicker} data={this.settingsAdminStore.types} cleanable={false} />
        </FormGroup>
        <FormGroup controlId="category" className="inline">
          <ControlLabel>
            <Translation message="Category" />
          </ControlLabel>
          <FormControl name="category" />
        </FormGroup>
        <FormGroup controlId="public" className="inline">
          <ControlLabel>
            <Translation message="Public" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <Checkbox checked={item.public} onChange={setCheckboxItemValue.bind(null, 'public')} />
          </div>
        </FormGroup>
        <FormGroup controlId="value">
          <ControlLabel>
            <Translation message="Value" />
          </ControlLabel>
          {this.getValueInput()}
        </FormGroup>
      </Form>
    );
  }
}

SettingsForm.propTypes = {
  settingsAdminStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('settingsAdminStore'), observer);

export default enhance(SettingsForm);
