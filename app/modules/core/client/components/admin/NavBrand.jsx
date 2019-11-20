import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'rsuite';
import Translation from 'app/modules/core/client/components/Translation';

class NavBrand extends React.Component {
  render() {
    return (
      <Link to="/admin" className="nav-brand logo">
        <Icon className="icon" icon="cubes" size="lg" />
        <span className="brand">
          <Translation message="Brand" />
        </span>
      </Link>
    );
  }
}

export default NavBrand;
