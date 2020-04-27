import React from 'react';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Nav, Dropdown } from 'rsuite';
import { withRouter } from 'react-router-dom';
import NavLink from 'app/modules/core/ui/components/NavLink';
import DropdownLink from 'modules/core/ui/components/DropdownLink';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
  }

  getLinkItem(item, level, i) {
    const props = {};
    let LinkComponent = NavLink;
    if (level > 0) {
      LinkComponent = DropdownLink;
    }
    if (item.openInNewPage) {
      props.target = '_blank';
    }
    if (item.url.indexOf('http') === 0) {
      return (
        <LinkComponent key={`${level}-${i}`} href={item.url} {...props}>
          {item.title}
        </LinkComponent>
      );
    } else {
      return (
        <LinkComponent key={`${level}-${i}`} to={item.url} {...props}>
          {item.title}
        </LinkComponent>
      );
    }
  }

  getNavigationItems(navigation, level = 0) {
    let items = [];
    let item;
    for (let i = 0; i < navigation.length; i++) {
      item = navigation[i];
      if (item.enabled) {
        if (item.children && item.children.length > 0) {
          if (level > 0) {
            items.push(
              <Dropdown.Menu key={`${level}-${i}`} title={item.title}>
                {this.getNavigationItems(item.children, level + 1)}
              </Dropdown.Menu>
            );
          } else {
            items.push(
              <Dropdown key={`${level}-${i}`} title={item.title}>
                {this.getNavigationItems(item.children, level + 1)}
              </Dropdown>
            );
          }
        } else {
          items.push(this.getLinkItem(item, level, i));
        }
      }
    }
    return items;
  }

  getNavigation(name) {
    const { navigationStore, navigationStore: { navigation = {} } = {} } = this.props;
    if (navigation[name]) {
      return navigation[name];
    } else {
      navigationStore.loadByName(name);
    }
    return null;
  }

  render() {
    const { navigationName, vertical = false, showTitle = false, style = {}, className = '' } = this.props;
    const navigation = this.getNavigation(navigationName);
    let navClassName = classNames(className, 'nav-wrapper');
    if (navigation) {
      navClassName = classNames(navClassName, `nav-${navigation.name}`);
    }
    return (
      <div className={navClassName}>
        {navigation && showTitle && <div className="nav-title">{navigation.title}</div>}
        {navigation && (
          <Nav vertical={vertical} style={style}>
            {this.getNavigationItems(navigation.items)}
          </Nav>
        )}
      </div>
    );
  }
}

Navigation.propTypes = {
  showTitle: PropTypes.bool,
  className: PropTypes.string,
  navigationName: PropTypes.string,
  style: PropTypes.object,
  vertical: PropTypes.bool,
  authStore: PropTypes.object,
  uiStore: PropTypes.object,
  templatesStore: PropTypes.object,
  navigationStore: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
};

const enhance = compose(withRouter, inject('authStore', 'uiStore', 'templatesStore', 'navigationStore'), observer);

export default enhance(Navigation);
