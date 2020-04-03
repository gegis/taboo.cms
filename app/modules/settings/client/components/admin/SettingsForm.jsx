import React from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Checkbox, SelectPicker } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Translation from 'app/modules/core/client/components/Translation';
import CodeEditor from 'modules/core/client/components/CodeEditor';

class SettingsForm extends React.Component {
  constructor(props) {
    super(props);
    this.settingsStore = props.settingsStore;
    this.onCodeEditorChange = this.onCodeEditorChange.bind(this);
  }

  onCodeEditorChange(editorValue) {
    this.settingsStore.setItem({ originalValue: editorValue });
  }

  getValueInput() {
    const {
      item,
      setCheckboxItemValue,
      item: { type = '' },
    } = this.settingsStore;
    let element = <FormControl name="value" />;

    if (type === 'object') {
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
    const { setItem, item, setCheckboxItemValue } = this.settingsStore;
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
          <FormControl name="type" accepter={SelectPicker} data={this.settingsStore.types} cleanable={false} />
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
  settingsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('settingsStore'), observer);

export default enhance(SettingsForm);
