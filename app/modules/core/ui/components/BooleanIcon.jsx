import React from 'react';
import PropTypes from 'prop-types';

const BooleanIcon = ({ value, size = 'md', className = '', ...props }) => {
  let src = '/images/_shared/icon-ok.png';
  if (value) {
    src = '/images/_shared/icon-cancel.png';
  }
  className = `icon-img ${size} ${className}`;
  return <img src={src} {...props} className={className} />;
};

BooleanIcon.propTypes = {
  value: PropTypes.bool,
  size: PropTypes.string,
  className: PropTypes.string,
};

export default BooleanIcon;
