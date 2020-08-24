import React from 'react';
import { Icon } from 'rsuite';

import Roles from './components/admin/Roles';

import RolesStore from './stores/RolesStore';
import ACLStore from './stores/ACLStore';

const enabled = true;

const stores = {
  aclStore: ACLStore,
  rolesStore: RolesStore,
};

const routes = [
  {
    path: '/admin/roles',
    exact: true,
    component: Roles,
    admin: true,
  },
];

const primaryMenu = [
  {
    order: 1010,
    icon: React.createElement(Icon, { icon: 'unlock-alt' }),
    name: 'User Roles',
    linkProps: {
      to: '/admin/roles',
    },
    acl: 'admin.acl.view',
  },
];

export { enabled, routes, stores, primaryMenu };
