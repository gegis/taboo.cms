import React from 'react';
import { Icon } from 'rsuite';
import IndexPage from './components/admin/IndexPage';

import RouterStore from './stores/RouterStore';
import UIAdminStore from './stores/UIAdminStore';
import NotificationsStore from './stores/NotificationsStore';
import LocaleStore from './stores/LocaleStore';

const enabled = true;

const stores = {
  routerStore: RouterStore,
  uiAdminStore: UIAdminStore,
  notificationsStore: NotificationsStore,
  localeStore: LocaleStore,
};

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
