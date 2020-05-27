import React from 'react';
import { observer, inject } from 'mobx-react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { Sidenav, Sidebar as RsSidebar, Nav, Navbar, Divider, Icon, Dropdown } from 'rsuite';
import classNames from 'classnames';

import NavBrand from './NavBrand';
import AdminConfigHelper from 'app/modules/core/ui/helpers/AdminConfigHelper';
import Translation from 'app/modules/core/ui/components/Translation';
import NavLink from 'app/modules/core/ui/components/admin/NavLink';
import NavDropDownLink from 'app/modules/core/ui/components/admin/NavDropDownLink';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.aclStore = props.aclStore;
    this.uiAdminStore = props.uiAdminStore;
    this.handleToggle = this.handleToggle.bind(this);
    this.onDropdownOpen = this.onDropdownOpen.bind(this);
    this.onDropdownSelect = this.onDropdownSelect.bind(this);
  }

  onDropdownOpen(keys) {
    this.uiAdminStore.setExpandedSidebarItems(keys);
  }

  onDropdownSelect(key) {
    this.uiAdminStore.setExpandedSidebarItems([key]);
  }

  getMenuItems() {
    const items = AdminConfigHelper.getPrimaryMenuItems();
    const menuItems = [];
    let menuItemChildren = [];
    [...items].map((item, i) => {
      if (this.aclStore.isAllowed(this.aclStore.userACL, item.acl)) {
        if (item.dropdown && item.dropdown.length > 0) {
          menuItemChildren = [];
          item.dropdown.map((child, j) => {
            menuItemChildren.push(
              <NavDropDownLink key={`${i}-${j}`} icon={child.icon} {...child.linkProps}>
                <Translation message={child.text} />
              </NavDropDownLink>
            );
          });
          menuItems.push(
            <Dropdown key={i} eventKey={i} trigger="click" title={item.text} icon={item.icon}>
              {menuItemChildren}
            </Dropdown>
          );
        } else {
          menuItems.push(
            <NavLink key={i} eventKey={i} icon={item.icon} onSelect={this.onDropdownSelect} {...item.linkProps}>
              <Translation message={item.text} />
            </NavLink>
          );
        }
      }
    });
    return menuItems;
  }

  handleToggle() {
    this.uiAdminStore.toggleAdminSidebar();
  }

  render() {
    return (
      <RsSidebar
        className={classNames(
          'sidebar',
          this.uiAdminStore.sidebarOpen && 'open',
          !this.uiAdminStore.sidebarOpen && 'closed'
        )}
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
        <Sidenav
          expanded={this.uiAdminStore.sidebarOpen}
          defaultOpenKeys={[]}
          openKeys={this.uiAdminStore.expandedSidebarItems}
          onOpenChange={this.onDropdownOpen}
          appearance="subtle"
        >
          <Sidenav.Body>
            <Nav>{this.getMenuItems()}</Nav>
          </Sidenav.Body>
        </Sidenav>
        <Divider className="nav-toggle-divider" />
        <Navbar appearance="subtle" className="nav-toggle">
          <Navbar.Body>
            <Nav pullRight>
              <Nav.Item onClick={this.handleToggle} className="sidebar-toggle-btn">
                <Icon icon={this.uiAdminStore.sidebarOpen ? 'angle-left' : 'angle-right'} />
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
