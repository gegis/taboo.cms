import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, Icon, InputGroup } from 'rsuite';
import UploadSelect from 'modules/uploads/ui/components/admin/UploadSelect';

class ImagePicker extends React.Component {
  constructor(props) {
    super(props);
    this.imageSelect = React.createRef();
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onUploadSelect = this.onUploadSelect.bind(this);
  }

  onButtonClick() {
    const { current } = this.imageSelect;
    if (current) {
      current.open();
    }
  }

  onUploadSelect(upload) {
    const { onChange = () => {}, returnValueKey = 'url' } = this.props;
    if (upload && upload[returnValueKey]) {
      onChange(upload[returnValueKey]);
    }
  }

  getButton() {
    const { button } = this.props;
    if (button) {
      return button;
    }
    return (
      <Button className="select-upload-btn" onClick={this.onButtonClick} title="Select Image">
        <Icon icon="file-image-o" />
      </Button>
    );
  }

  getPreview() {
    const { value, showPreview = false } = this.props;
    if (showPreview) {
      return (
        <div className="color-picker-preview">
          <a href={value} target="_blank" rel="noopener noreferrer" title="Click to open image in new tab">
            <img src={value} />
          </a>
        </div>
      );
    }
    return null;
  }

  getInput() {
    const { input, onClear = null } = this.props;
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
    const { className } = this.props;

    return (
      <div className={classNames('image-picker', className)}>
        {this.getInput()}
        {this.getButton()}
        {this.getPreview()}
        <UploadSelect
          ref={this.imageSelect}
          onFileSelect={this.onUploadSelect}
          closeOnSelect={true}
          filter={{ type: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'], isUserFile: false }}
        />
      </div>
    );
  }
}

ImagePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  returnValueKey: PropTypes.string,
  showPreview: PropTypes.bool,
  input: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  button: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.string,
  onClear: PropTypes.func,
};

export default ImagePicker;
