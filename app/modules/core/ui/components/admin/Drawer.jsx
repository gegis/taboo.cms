import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Drawer as RsDrawer, Button } from 'rsuite';
import Translation from 'app/modules/core/ui/components/Translation';

class Drawer extends Component {
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
      full = false,
      keyboard = false,
      size = 'lg',
      placement = 'left',
      backdrop = 'static',
      children,
      title,
      onSubmit,
      submitName = 'Save',
      cancelName = 'Cancel',
      customButtons,
      ...rest
    } = this.props;
    return (
      <RsDrawer
        full={full}
        keyboard={keyboard}
        size={size}
        placement={placement}
        backdrop={backdrop}
        {...rest}
        show={this.state.show}
        onHide={this.close}
      >
        {title && (
          <RsDrawer.Header>
            {typeof title === 'string' && (
              <RsDrawer.Title>
                <Translation message={title} />
              </RsDrawer.Title>
            )}
            {typeof title === 'object' && <RsDrawer.Title>{title}</RsDrawer.Title>}
          </RsDrawer.Header>
        )}
        <RsDrawer.Body>{children}</RsDrawer.Body>
        <RsDrawer.Footer>
          {customButtons && customButtons}
          <Button onClick={this.close} appearance="subtle">
            <Translation message={cancelName} />
          </Button>
          {onSubmit && (
            <Button onClick={onSubmit} appearance="primary">
              <Translation message={submitName} />
            </Button>
          )}
        </RsDrawer.Footer>
      </RsDrawer>
    );
  }
}

Drawer.propTypes = {
  full: PropTypes.bool,
  keyboard: PropTypes.bool,
  size: PropTypes.oneOf(['lg', 'md', 'sm', 'xs']),
  placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  backdrop: PropTypes.oneOf(['static', true, false]),
  children: PropTypes.node.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  submitName: PropTypes.string,
  cancelName: PropTypes.string,
  onSubmit: PropTypes.func,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  customButtons: PropTypes.node,
};

export default Drawer;
