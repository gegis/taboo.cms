import React from 'react';
import { Icon } from 'rsuite';

import Users from './components/admin/Users';
import Login from './components/admin/Login';
import ResetPassword from './components/admin/ResetPassword';
import ChangePassword from './components/admin/ChangePassword';

import { stores as usersStores } from './stores';

const enabled = true;

const stores = {
  authStore: usersStores.authStore,
  usersStore: usersStores.usersAdminStore,
};

const routes = [
  {
    path: '/admin/users',
    exact: true,
    component: Users,
    admin: true,
  },
  {
    path: '/admin/login',
    component: Login,
  },
  {
    path: '/admin/reset-password',
    component: ResetPassword,
  },
  {
    path: '/admin/change-password/:userId/:token',
    component: ChangePassword,
  },
];

const primaryMenu = [
  {
    order: 1000,
    icon: React.createElement(Icon, { icon: 'group' }),
    text: 'Users',
    linkProps: {
      to: '/admin/users',
    },
    acl: 'admin.users.view',
  },
];

export { enabled, routes, stores, primaryMenu };
