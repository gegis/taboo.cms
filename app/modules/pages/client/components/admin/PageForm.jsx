import React from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Checkbox, CheckboxGroup, SelectPicker } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Translation from 'app/modules/core/client/components/Translation';
import CodeEditor from 'app/modules/core/client/components/CodeEditor';

class PageForm extends React.Component {
  constructor(props) {
    super(props);
    this.pagesStore = props.pagesStore;
    this.onCodeEditorChange = this.onCodeEditorChange.bind(this);
    this.openInRichTextEditor = this.openInRichTextEditor.bind(this);
  }

  onCodeEditorChange(value) {
    this.pagesStore.setPage({ body: value });
  }

  openInRichTextEditor() {
    this.pagesStore.showRichTextEditor();
  }

  render() {
    const { page } = this.pagesStore;
    return (
      <Form layout="horizontal" fluid onChange={this.pagesStore.setPage} formValue={page}>
        {page.id && (
          <FormGroup controlId="id" className="inline">
            <ControlLabel>
              <Translation message="ID" />
            </ControlLabel>
            <FormControl name="id" disabled />
          </FormGroup>
        )}
        {page.id && <div className="clearfix" />}
        <FormGroup controlId="title" className="inline">
          <ControlLabel>
            <Translation message="Title" />
          </ControlLabel>
          <FormControl name="title" />
        </FormGroup>
        <FormGroup controlId="url" className="inline">
          <ControlLabel>
            <Translation message="URL" />
          </ControlLabel>
          <FormControl name="url" />
        </FormGroup>
        <FormGroup controlId="layout" className="inline">
          <ControlLabel>
            <Translation message="Layout" />
          </ControlLabel>
          <FormControl name="layout" accepter={SelectPicker} data={this.pagesStore.layoutOptions} />
        </FormGroup>
        <FormGroup controlId="language" className="inline">
          <ControlLabel>
            <Translation message="Language" />
          </ControlLabel>
          <FormControl name="language" accepter={SelectPicker} data={this.pagesStore.languageOptions} />
        </FormGroup>
        <FormGroup controlId="published" className="inline">
          <ControlLabel>
            <Translation message="Published" />
          </ControlLabel>
          <FormControl name="publishedGroup" accepter={CheckboxGroup}>
            <Checkbox value="published" />
          </FormControl>
        </FormGroup>
        <FormGroup controlId="body">
          <ControlLabel>
            <Translation message="Body" />
          </ControlLabel>
          <CodeEditor
            onChange={this.onCodeEditorChange}
            value={this.pagesStore.page.body}
            width="auto"
            height="400px"
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

PageForm.propTypes = {
  pagesStore: PropTypes.object.isRequired,
};

const enhance = compose(
  inject('pagesStore'),
  observer
);

export default enhance(PageForm);
