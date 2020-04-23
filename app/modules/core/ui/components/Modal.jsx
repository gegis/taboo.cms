import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal as RsModal, Button } from 'rsuite';
import Translation from 'app/modules/core/ui/components/Translation';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }
  open() {
    const { onOpen } = this.props;
    if (onOpen) {
      onOpen();
    }
    this.setState({
      show: true,
    });
  }

  close() {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
    this.setState({
      show: false,
    });
  }

  render() {
    const {
      children,
      title,
      onSubmit,
      size = 'lg',
      submitName = 'Save',
      cancelName = 'Cancel',
      customButtons,
      ...rest
    } = this.props;
    return (
      <RsModal size={size} {...rest} show={this.state.show} onHide={this.close}>
        {title && (
          <RsModal.Header>
            <RsModal.Title>
              <Translation message={title} />
            </RsModal.Title>
          </RsModal.Header>
        )}
        <RsModal.Body>{children}</RsModal.Body>
        <RsModal.Footer>
          {customButtons && customButtons}
          {cancelName && (
            <Button onClick={this.close} appearance="default" className="subtle-ghost">
              <Translation message={cancelName} />
            </Button>
          )}
          {onSubmit && (
            <Button onClick={onSubmit} appearance="primary">
              <Translation message={submitName} />
            </Button>
          )}
        </RsModal.Footer>
      </RsModal>
    );
  }
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.string,
  title: PropTypes.string,
  submitName: PropTypes.string,
  cancelName: PropTypes.string,
  onSubmit: PropTypes.func,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  customButtons: PropTypes.node,
};

export default Modal;
