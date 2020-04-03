import React from 'react';
import { Icon } from 'rsuite';

import Settings from './components/admin/Settings';
import SettingsAdminStore from './stores/SettingsAdminStore';

const enabled = true;

const routes = [
  {
    path: '/admin/settings',
    exact: true,
    component: Settings,
    admin: true,
  },
];

const stores = {
  settingsStore: SettingsAdminStore,
};

const primaryMenu = [
  {
    order: 2000,
    icon: React.createElement(Icon, { icon: 'sliders' }),
    text: 'Settings',
    linkProps: {
      to: '/admin/settings',
    },
    acl: 'admin.settings.view',
  },
];

export { enabled, routes, stores, primaryMenu };
