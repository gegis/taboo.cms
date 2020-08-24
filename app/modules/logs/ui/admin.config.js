import React from 'react';
import { Icon } from 'rsuite';

import LogsApi from './components/admin/LogsApi';
import LogsApiAdminStore from './stores/LogsApiAdminStore';

const enabled = true;

const routes = [
  {
    path: '/admin/logs/api',
    exact: true,
    component: LogsApi,
    admin: true,
  },
];

const stores = {
  logsApiAdminStore: LogsApiAdminStore,
};

const primaryMenu = [
  {
    order: 3000,
    icon: React.createElement(Icon, { icon: 'file-o' }),
    name: 'Logs',
    acl: 'admin.logs.api.view',
    dropdown: [
      {
        icon: React.createElement(Icon, { icon: 'file-o' }),
        name: 'API Logs',
        linkProps: {
          to: '/admin/logs/api',
        },
        acl: 'admin.logs.api.view',
      },
    ],
  },
];

export { enabled, routes, stores, primaryMenu };
