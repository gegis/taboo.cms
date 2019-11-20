import React from 'react';
import { Icon } from 'rsuite';
import PropTypes from 'prop-types';

const BooleanIcon = ({ value, size = 'lg', ...props }) => {
  let icon = 'square-o';
  if (value) {
    icon = 'check-square-o';
  }
  return <Icon {...props} size={size} icon={icon} />;
};

BooleanIcon.propTypes = {
  value: PropTypes.bool,
  size: PropTypes.string,
};

export default BooleanIcon;
