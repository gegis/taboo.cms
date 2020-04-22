import React from 'react';
import { Icon } from 'rsuite';

import Templates from './components/admin/Templates';
import TemplatesAdminStore from './stores/TemplatesAdminStore';

const enabled = true;

const routes = [
  {
    path: '/admin/templates',
    exact: true,
    component: Templates,
    admin: true,
  },
];

const stores = {
  templatesStore: TemplatesAdminStore,
};

const primaryMenu = [
  {
    order: 340,
    icon: React.createElement(Icon, { icon: 'frame' }),
    text: 'Templates',
    linkProps: {
      to: '/admin/templates',
    },
    acl: 'admin.templates.view',
  },
];

export { enabled, routes, stores, primaryMenu };
