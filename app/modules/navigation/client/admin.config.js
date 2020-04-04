import React from 'react';
import { Icon } from 'rsuite';

import Navigation from './components/admin/Navigation';
import NavigationAdminStore from './stores/NavigationAdminStore';

const enabled = true;

const routes = [
  {
    path: '/admin/navigation/:type',
    exact: true,
    component: Navigation,
    admin: true,
  },
];

const stores = {
  navigationStore: NavigationAdminStore,
};

const primaryMenu = [
  {
    order: 325,
    icon: React.createElement(Icon, { icon: 'bars' }),
    text: 'Navigation',
    acl: 'admin.navigation.view',
    dropdown: [
      {
        icon: React.createElement(Icon, { icon: 'project' }),
        text: 'Website Navigation',
        linkProps: {
          to: '/admin/navigation/website',
        },
        acl: 'admin.navigation.view',
      },
      {
        icon: React.createElement(Icon, { icon: 'street-view' }),
        text: 'User Navigation',
        linkProps: {
          to: '/admin/navigation/user',
        },
        acl: 'admin.navigation.view',
      },
    ],
  },
];

export { enabled, routes, stores, primaryMenu };
