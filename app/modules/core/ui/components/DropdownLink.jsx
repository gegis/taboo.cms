import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Dropdown } from 'rsuite';
import Link from 'modules/core/ui/components/Link';

const DropdownLink = props => {
  const { to, ...rest } = props;
  if (to && to.indexOf('http') !== 0) {
    return <Dropdown.Item componentClass={RouterNavLink} exact activeClassName="active" to={to} {...rest} />;
  } else {
    return <Dropdown.Item componentClass={Link} exact activeClassName="active" href={to} {...rest} />;
  }
};

export default DropdownLink;
