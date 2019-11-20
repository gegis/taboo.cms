import React from 'react';
import { observer, inject } from 'mobx-react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { Sidenav, Sidebar as RsSidebar, Nav, Navbar, Divider, Icon } from 'rsuite';
import classNames from 'classnames';

import NavBrand from './NavBrand';
import AdminConfigHelper from 'app/modules/core/client/helpers/AdminConfigHelper';
import Translation from 'app/modules/core/client/components/Translation';
import NavLink from 'app/modules/core/client/components/admin/NavLink';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.aclStore = props.aclStore;
    this.handleToggle = this.handleToggle.bind(this);
  }

  getPrimaryMenuItems() {
    const items = AdminConfigHelper.getPrimaryMenuItems();
    const menuItems = [];
    [...items].map((item, i) => {
      if (this.aclStore.isAllowed(this.aclStore.userACL, item.acl)) {
        menuItems.push(
          <NavLink key={i} icon={item.icon} {...item.linkProps}>
            <Translation message={item.text} />
          </NavLink>
        );
      }
    });
    return menuItems;
  }

  handleToggle() {
    const { settingsStore } = this.props;
    settingsStore.toggleAdminSidebar();
  }

  render() {
    const { settingsStore } = this.props;
    return (
      <RsSidebar
        className={classNames('sidebar', settingsStore.open && 'open', !settingsStore.open && 'closed')}
        width="auto"
        collapsible
      >
        <Sidenav.Header>
          <Navbar appearance="inverse">
            <Navbar.Header>
              <NavBrand />
            </Navbar.Header>
          </Navbar>
        </Sidenav.Header>
        <Sidenav expanded={settingsStore.open} defaultOpenKeys={['3']} defaultactivekey="2" appearance="subtle">
          <Sidenav.Body>
            <Nav>
              {this.getPrimaryMenuItems()}
              {/*TODO implement menu items with children*/}
              {/*<Dropdown*/}
              {/*eventKey="4"*/}
              {/*trigger="hover"*/}
              {/*title="Settings"*/}
              {/*icon={<Icon icon="gear-circle" />}*/}
              {/*placement="right"*/}
              {/*>*/}
              {/*<Dropdown.Item eventKey="4-1">Applications</Dropdown.Item>*/}
              {/*<Dropdown.Item eventKey="4-2">Websites</Dropdown.Item>*/}
              {/*<Dropdown.Item eventKey="4-3">Channels</Dropdown.Item>*/}
              {/*<Dropdown.Item eventKey="4-4">Tags</Dropdown.Item>*/}
              {/*<Dropdown.Item eventKey="4-5">Versions</Dropdown.Item>*/}
              {/*</Dropdown>*/}
            </Nav>
          </Sidenav.Body>
        </Sidenav>
        <Divider className="nav-toggle-divider" />
        <Navbar appearance="subtle" className="nav-toggle">
          <Navbar.Body>
            <Nav pullRight>
              <Nav.Item onClick={this.handleToggle} className="sidebar-toggle-btn">
                <Icon icon={settingsStore.open ? 'angle-left' : 'angle-right'} />
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
  settingsStore: PropTypes.object.isRequired,
};

const enhance = compose(
  inject('aclStore', 'settingsStore'),
  observer
);

export default enhance(Sidebar);
