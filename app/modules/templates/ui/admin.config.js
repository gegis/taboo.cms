import React from 'react';
import { Icon } from 'rsuite';

import Templates from './components/admin/Templates';
import TemplatesAdminStore from './stores/TemplatesAdminStore';
import TemplatesStore from './stores/TemplatesStore';

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
  templatesAdminStore: TemplatesAdminStore,
  templatesStore: TemplatesStore,
};

const primaryMenu = [
  {
    order: 340,
    icon: React.createElement(Icon, { icon: 'web' }),
    text: 'Templates',
    linkProps: {
      to: '/admin/templates',
    },
    acl: 'admin.templates.view',
  },
];

export { enabled, routes, stores, primaryMenu };
