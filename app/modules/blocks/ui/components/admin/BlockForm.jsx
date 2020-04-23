import React from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Checkbox, SelectPicker } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Translation from 'app/modules/core/ui/components/Translation';
import CodeEditor from 'modules/core/ui/components/CodeEditor';

class BlockForm extends React.Component {
  constructor(props) {
    super(props);
    this.blocksStore = props.blocksStore;
    this.localeStore = props.localeStore;
    this.onCodeEditorChange = this.onCodeEditorChange.bind(this);
    this.openInRichTextEditor = this.openInRichTextEditor.bind(this);
  }

  onCodeEditorChange(value) {
    this.blocksStore.setItem({ body: value });
  }

  openInRichTextEditor() {
    // this.blocksStore.showRichTextEditor();
  }

  render() {
    const { setItem, item, setCheckboxItemValue } = this.blocksStore;
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
        <FormGroup controlId="name" className="inline">
          <ControlLabel>
            <Translation message="Name" />
          </ControlLabel>
          <FormControl name="name" />
        </FormGroup>
        <FormGroup controlId="type" className="inline">
          <ControlLabel>
            <Translation message="Type" />
          </ControlLabel>
          <FormControl name="type" />
        </FormGroup>
        <FormGroup controlId="language" className="inline">
          <ControlLabel>
            <Translation message="Language" />
          </ControlLabel>
          <FormControl name="language" accepter={SelectPicker} data={this.localeStore.languageOptions} />
        </FormGroup>
        <FormGroup controlId="enabled" className="inline">
          <ControlLabel>
            <Translation message="Enabled" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <Checkbox checked={item.enabled} onChange={setCheckboxItemValue.bind(null, 'enabled')} />
          </div>
        </FormGroup>
        <FormGroup controlId="body">
          <ControlLabel>
            <Translation message="Body" />
          </ControlLabel>
          <CodeEditor
            onChange={this.onCodeEditorChange}
            value={item.body}
            width="auto"
            height="360px"
            className="code-editor"
          />
          <div className="richTextBtnWrapper">
            <button onClick={this.openInRichTextEditor} className="rs-btn">
              Open in Rich Text Editor
            </button>
          </div>
        </FormGroup>
      </Form>
    );
  }
}

BlockForm.propTypes = {
  blocksStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('blocksStore', 'localeStore'), observer);

export default enhance(BlockForm);
