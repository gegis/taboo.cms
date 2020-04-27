import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Link extends React.Component {
  render() {
    const { exact = false, activeClassName, className, children, location = {}, href, target = '' } = this.props;
    let linkClassName = className;
    let props = {};
    if (target) {
      props.target = target;
    }
    if (activeClassName) {
      if (exact && href === location.pathname) {
        linkClassName = classNames(className, activeClassName);
      } else if (location.pathname.indexOf(href) === 0) {
        linkClassName = classNames(className, activeClassName);
      }
    }
    return (
      <a className={linkClassName} href={href} {...props}>
        {children}
      </a>
    );
  }
}

Link.propTypes = {
  exact: PropTypes.bool,
  children: PropTypes.node,
  href: PropTypes.string,
  target: PropTypes.string,
  className: PropTypes.string,
  activeClassName: PropTypes.string,
  location: PropTypes.object,
};

export default withRouter(Link);
