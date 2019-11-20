import React from 'react';
import { Icon } from 'rsuite';
import { stores } from './stores.config';
import IndexPage from './components/admin/IndexPage';

const routes = [
  {
    path: '/admin',
    exact: true,
    component: IndexPage,
    admin: true,
  },
];

const primaryMenu = [
  {
    order: 100,
    icon: React.createElement(Icon, { icon: 'dashboard' }),
    text: 'Dashboard',
    linkProps: {
      to: '/admin',
    },
    acl: 'admin.dashboard',
  },
];

export { routes, stores, primaryMenu };
