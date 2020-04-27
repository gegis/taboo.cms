import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Nav } from 'rsuite';
import Link from 'modules/core/ui/components/Link';

const NavLink = props => {
  const { to, ...rest } = props;
  if (to && to.indexOf('http') !== 0) {
    return <Nav.Item componentClass={RouterNavLink} exact activeClassName="active" to={to} {...rest} />;
  } else {
    return <Nav.Item componentClass={Link} exact activeClassName="active" href={to} {...rest} />;
  }
};

export default NavLink;
