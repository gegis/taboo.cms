import React from 'react';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Nav, Dropdown } from 'rsuite';
import { withRouter } from 'react-router-dom';
import NavLink from 'app/modules/core/client/components/NavLink';
import DropdownLink from 'modules/core/client/components/DropdownLink';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
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
          if (level > 0) {
            items.push(
              <DropdownLink key={`${level}-${i}`} className="" to={item.url}>
                {item.title}
              </DropdownLink>
            );
          } else {
            items.push(
              <NavLink key={`${level}-${i}`} className="" to={item.url}>
                {item.title}
              </NavLink>
            );
          }
        }
      }
    }
    return items;
  }

  render() {
    const { navigationName, navigationStore, vertical = false } = this.props;
    const { navigation } = navigationStore;
    if (navigationName && navigation && navigation[navigationName]) {
      return (
        <Nav vertical={vertical} className="navigation">
          {this.getNavigationItems(navigation[navigationName])}
        </Nav>
      );
    }
    return null;
  }
}

Navigation.propTypes = {
  navigationName: PropTypes.string,
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
