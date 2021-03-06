import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, Icon, InputGroup } from 'rsuite';
import { Sketch, ChromePicker } from 'react-color';

class ColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false,
    };
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onButtonClick() {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  }

  onClose() {
    this.setState({ displayColorPicker: false });
  }

  onChange(value) {
    const { onChange = () => {}, returnValueKey = null } = this.props;
    if (returnValueKey && value && value[returnValueKey]) {
      onChange(value[returnValueKey]);
    } else {
      onChange(value);
    }
  }

  getPicker() {
    const { type = 'ChromePicker', value } = this.props;
    switch (type) {
      case 'ChromePicker':
        return <ChromePicker color={value} onChange={this.onChange} />;
      case 'Sketch':
        return <Sketch color={value} onChange={this.onChange} />;
    }
  }

  getButton() {
    const { button } = this.props;
    if (button) {
      return button;
    }
    return (
      <Button className="color-pick-btn" onClick={this.onButtonClick}>
        <Icon icon="eyedropper" />
      </Button>
    );
  }

  getBackdrop() {
    const { backdropClassName } = this.props;
    const backdropStyles = {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    };
    return (
      <div
        style={backdropStyles}
        className={classNames('color-picker-backdrop', backdropClassName)}
        onClick={this.onClose}
      />
    );
  }

  getPreview() {
    const { value } = this.props;
    return <div className="color-picker-preview" style={{ backgroundColor: value }} onClick={this.onButtonClick} />;
  }

  getInput() {
    const { input, onClear } = this.props;
    if (input) {
      return (
        <div className="input-wrapper">
          <InputGroup inside>
            {input}
            {onClear && (
              <InputGroup.Button onClick={onClear}>
                <Icon icon="times-circle" />
              </InputGroup.Button>
            )}
          </InputGroup>
        </div>
      );
    }
    return null;
  }

  render() {
    const { className, wrapperClassName } = this.props;

    return (
      <div className={classNames('color-picker', className)}>
        {this.getInput()}
        {this.getPreview()}
        {this.getButton()}
        {this.state.displayColorPicker ? (
          <div className={classNames('color-picker-wrapper', wrapperClassName)}>
            {this.getBackdrop()}
            {this.getPicker()}
          </div>
        ) : null}
      </div>
    );
  }
}

ColorPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  value: PropTypes.string,
  returnValueKey: PropTypes.string,
  type: PropTypes.oneOf(['ChromePicker', 'Sketch']),
  input: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  button: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.string,
  wrapperClassName: PropTypes.string,
  backdropClassName: PropTypes.string,
};

export default ColorPicker;
