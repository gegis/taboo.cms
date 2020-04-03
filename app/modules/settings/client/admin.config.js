import React from 'react';
import { Icon } from 'rsuite';

import SettingsGeneric from './components/admin/SettingsGeneric';
import SettingsAdminStore from './stores/SettingsAdminStore';

const enabled = true;

const routes = [
  {
    path: '/admin/settings/generic',
    exact: true,
    component: SettingsGeneric,
    admin: true,
  },
];

const stores = {
  settingsStore: SettingsAdminStore,
};

const primaryMenu = [
  {
    order: 2000,
    icon: React.createElement(Icon, { icon: 'cog' }),
    text: 'Settings',
    acl: 'admin.settings.view',
    dropdown: [
      {
        icon: React.createElement(Icon, { icon: 'sliders' }),
        text: 'Generic',
        linkProps: {
          to: '/admin/settings/generic',
        },
        acl: 'admin.settings.view',
      },
    ],
  },
];

export { enabled, routes, stores, primaryMenu };
