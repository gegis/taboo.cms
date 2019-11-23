import React from 'react';
import { Icon } from 'rsuite';
import IndexPage from './components/admin/IndexPage';

import RouterStore from './stores/RouterStore';
import SettingsStore from './stores/SettingsStore';
import NotificationsStore from './stores/NotificationsStore';
import LocaleStore from './stores/LocaleStore';

const enabled = true;

const stores = {
  routerStore: RouterStore,
  settingsStore: SettingsStore,
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
