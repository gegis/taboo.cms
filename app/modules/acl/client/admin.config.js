import React from 'react';
import { Icon } from 'rsuite';

import Roles from './components/admin/Roles';
import { stores } from './stores.config';

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
    text: 'User Roles',
    linkProps: {
      to: '/admin/roles',
    },
    acl: 'admin.acl.view',
  },
];

export { routes, stores, primaryMenu };
