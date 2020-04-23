import React from 'react';
import { compose } from 'recompose';
import { autorun } from 'mobx';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { html as htmlBeautify } from 'js-beautify';

import RichTextEditor from 'app/modules/core/ui/components/RichTextEditor';
import Modal from 'app/modules/core/ui/components/admin/Modal';

class RichTextModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.pagesStore = props.pagesStore;
    this.localeStore = props.localeStore;
    this.state = {
      value: this.pagesStore.page.body,
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCodeEditorChange = this.onCodeEditorChange.bind(this);
  }

  componentDidMount() {
    this.dispose = autorun(() => {
      const { pagesStore } = this.props;
      if (pagesStore.richTextEditorVisible === true) {
        this.open();
      }
    });
  }

  componentWillUnmount() {
    this.dispose();
  }

  open() {
    this.modal.current.open();
  }

  close() {
    this.modal.current.close();
  }

  onOpen() {
    this.setState({ value: this.pagesStore.item.body });
  }

  onClose() {
    this.pagesStore.hideRichTextEditor();
  }

  onSave() {
    this.pagesStore.setItem({ body: htmlBeautify(this.state.value) });
    this.close();
  }

  onCodeEditorChange(value) {
    this.setState({ value: value });
  }

  render() {
    const { value } = this.state;
    return (
      <Modal
        full
        backdrop="static"
        className="use-max-width"
        title="Edit Page"
        ref={this.modal}
        onOpen={this.onOpen}
        onClose={this.onClose}
        onSubmit={this.onSave}
        submitName="Update"
        cancelName="Cancel"
      >
        <div className="rich-text-editor-wrapper">
          <RichTextEditor onChange={this.onCodeEditorChange} value={value} />
        </div>
      </Modal>
    );
  }
}

RichTextModal.propTypes = {
  pagesStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('pagesStore', 'localeStore'), observer);

export default enhance(RichTextModal);
