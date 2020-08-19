import React from 'react';
import { InputPicker } from 'rsuite';
import PropTypes from 'prop-types';

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onChange(key, value) {
    this.props.onChange(key, value);
  }

  render() {
    const { title, options, filterKey, component, value = null } = this.props;
    let InputComponent = InputPicker;
    if (component) {
      InputComponent = component;
    }
    return (
      <InputComponent
        placeholder={title}
        style={{ width: 200 }}
        onChange={this.onChange.bind(this, filterKey)}
        data={options}
        value={value}
      />
    );
  }
}

Filter.propTypes = {
  filterKey: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.bool]),
  component: PropTypes.object,
};

export default Filter;
