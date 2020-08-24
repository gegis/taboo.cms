import React from 'react';
import { Icon } from 'rsuite';

import Navigation from './components/admin/Navigation';
import NavigationAdminStore from './stores/NavigationAdminStore';

const enabled = true;

const routes = [
  {
    path: '/admin/navigation',
    exact: true,
    component: Navigation,
    admin: true,
  },
];

const stores = {
  navigationAdminStore: NavigationAdminStore,
};

const primaryMenu = [
  {
    order: 325,
    icon: React.createElement(Icon, { icon: 'sitemap' }),
    name: 'Navigation',
    linkProps: {
      to: '/admin/navigation',
    },
    acl: 'admin.navigation.view',
  },
];

export { enabled, routes, stores, primaryMenu };
