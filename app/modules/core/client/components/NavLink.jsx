import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Nav } from 'rsuite';

const NavLink = props => <Nav.Item componentClass={RouterNavLink} exact activeClassName="active" {...props} />;

export default NavLink;
