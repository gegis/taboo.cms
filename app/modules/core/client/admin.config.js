import React from 'react';
import { Icon } from 'rsuite';
import { stores } from './stores';
import IndexPage from './components/admin/IndexPage';

const enabled = true;

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

export { enabled, routes, stores, primaryMenu };
