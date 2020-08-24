import React from 'react';
import { Icon } from 'rsuite';

import Users from './components/admin/Users';
import Login from './components/admin/Login';
import ResetPassword from './components/admin/ResetPassword';
import ChangePassword from './components/admin/ChangePassword';

import AuthStore from './stores/AuthStore';
import UsersAdminStore from './stores/UsersAdminStore';
import AdminHelper from 'modules/core/ui/helpers/AdminHelper';

const enabled = true;

const stores = {
  authStore: AuthStore,
  usersAdminStore: UsersAdminStore,
};

const routes = [
  {
    path: '/admin/users',
    exact: true,
    component: Users,
    admin: true,
  },
  {
    path: `/${AdminHelper.getAdminAccessUrlPrefix()}/login`,
    component: Login,
  },
  {
    path: `/${AdminHelper.getAdminAccessUrlPrefix()}/reset-password`,
    component: ResetPassword,
  },
  {
    path: `/${AdminHelper.getAdminAccessUrlPrefix()}/change-password/:userId/:token`,
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
