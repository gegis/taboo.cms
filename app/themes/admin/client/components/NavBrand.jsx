import React from 'react';
import { Link } from 'react-router-dom';

class NavBrand extends React.Component {
  render() {
    return (
      <Link to="/admin" className="nav-brand logo">
        <img src="/images/admin/logo-plain.png" />
        <span className="brand">Taboo CMS</span>
      </Link>
    );
  }
}

export default NavBrand;
