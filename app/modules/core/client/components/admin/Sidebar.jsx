import React from 'react';
import { observer, inject } from 'mobx-react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { Sidenav, Sidebar as RsSidebar, Nav, Navbar, Divider, Icon, Dropdown } from 'rsuite';
import classNames from 'classnames';

import NavBrand from './NavBrand';
import AdminConfigHelper from 'app/modules/core/client/helpers/AdminConfigHelper';
import Translation from 'app/modules/core/client/components/Translation';
import NavLink from 'app/modules/core/client/components/admin/NavLink';
import NavDropDownLink from 'app/modules/core/client/components/admin/NavDropDownLink';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.aclStore = props.aclStore;
    this.handleToggle = this.handleToggle.bind(this);
  }

  getPrimaryMenuItems() {
    const items = AdminConfigHelper.getPrimaryMenuItems();
    const menuItems = [];
    const menuItemChildren = [];
    [...items].map((item, i) => {
      if (this.aclStore.isAllowed(this.aclStore.userACL, item.acl)) {
        if (item.dropdown && item.dropdown.length > 0) {
          item.dropdown.map((child, j) => {
            menuItemChildren.push(
              <NavDropDownLink key={`${i}-${j}`} icon={child.icon} {...child.linkProps}>
                <Translation message={child.text} />
              </NavDropDownLink>
            );
          });
          menuItems.push(
            <Dropdown key={i} eventKey={i} title={item.text} icon={item.icon}>
              {menuItemChildren}
            </Dropdown>
          );
        } else {
          menuItems.push(
            <NavLink key={i} eventKey={i} icon={item.icon} {...item.linkProps}>
              <Translation message={item.text} />
            </NavLink>
          );
        }
      }
    });
    return menuItems;
  }

  handleToggle() {
    const { uiAdminStore } = this.props;
    uiAdminStore.toggleAdminSidebar();
  }

  render() {
    const { uiAdminStore } = this.props;
    return (
      <RsSidebar
        className={classNames('sidebar', uiAdminStore.open && 'open', !uiAdminStore.open && 'closed')}
        width="auto"
        collapsible
      >
        <Sidenav.Header>
          <Navbar appearance="default">
            <Navbar.Header>
              <NavBrand />
            </Navbar.Header>
          </Navbar>
        </Sidenav.Header>
        <Sidenav expanded={uiAdminStore.open} defaultOpenKeys={[0, 1, 2, 3]} defaultactivekey={0} appearance="subtle">
          <Sidenav.Body>
            <Nav>{this.getPrimaryMenuItems()}</Nav>
          </Sidenav.Body>
        </Sidenav>
        <Divider className="nav-toggle-divider" />
        <Navbar appearance="subtle" className="nav-toggle">
          <Navbar.Body>
            <Nav pullRight>
              <Nav.Item onClick={this.handleToggle} className="sidebar-toggle-btn">
                <Icon icon={uiAdminStore.open ? 'angle-left' : 'angle-right'} />
              </Nav.Item>
            </Nav>
          </Navbar.Body>
        </Navbar>
      </RsSidebar>
    );
  }
}
Sidebar.propTypes = {
  aclStore: PropTypes.object.isRequired,
  uiAdminStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('aclStore', 'uiAdminStore'), observer);

export default enhance(Sidebar);
