import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Dropdown } from 'rsuite';

const DropdownLink = props => (
  <Dropdown.Item componentClass={RouterNavLink} exact activeClassName="active" {...props} />
);

export default DropdownLink;
