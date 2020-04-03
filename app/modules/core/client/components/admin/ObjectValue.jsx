import React from 'react';
import PropTypes from 'prop-types';

const ObjectValue = ({ value, ...props }) => {
  return <div {...props}>{JSON.stringify(value)}</div>;
};

ObjectValue.propTypes = {
  value: PropTypes.any,
};

export default ObjectValue;
