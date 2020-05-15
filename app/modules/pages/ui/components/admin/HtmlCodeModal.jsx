import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import Modal from 'app/modules/core/ui/components/admin/Modal';
import Translation from 'modules/core/ui/components/Translation';
import CodeEditor from 'modules/core/ui/components/CodeEditor';

class HtmlCodeModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.state = { html: props.html };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCodeEditorChange = this.onCodeEditorChange.bind(this);
  }

  open() {
    this.modal.current.open();
  }

  close() {
    this.modal.current.close();
  }

  onOpen() {
    const { html } = this.props;
    this.setState({ html });
  }

  onClose() {
    this.setState({ html: '' });
  }

  onSave() {
    const { html } = this.state;
    const { setProps } = this.props;
    setProps({ html });
    this.close();
  }

  onCodeEditorChange(value) {
    this.setState({ html: value });
  }

  render() {
    const { html } = this.state;
    return (
      <Modal
        full
        backdrop="static"
        className="html-code-modal use-max-width"
        title={<Translation message="HTML Editor" />}
        ref={this.modal}
        onOpen={this.onOpen}
        onClose={this.onClose}
        onSubmit={this.onSave}
        submitName="Update"
        cancelName="Cancel"
      >
        <div className="rich-text-editor-wrapper">
          <CodeEditor onChange={this.onCodeEditorChange} value={html} width="auto" className="code-editor" />
        </div>
      </Modal>
    );
  }
}

HtmlCodeModal.propTypes = {
  html: PropTypes.string,
  setProps: PropTypes.func.isRequired,
};

const enhance = compose(inject('pagesStore', 'localeStore'), observer);

export default enhance(HtmlCodeModal);
