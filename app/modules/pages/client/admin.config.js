import React from 'react';
import { Icon } from 'rsuite';

import Pages from './components/admin/Pages';
import PagesAdminStore from './stores/PagesAdminStore';

const routes = [
  {
    path: '/admin/pages',
    exact: true,
    component: Pages,
    admin: true,
  },
];

const stores = {
  pagesStore: new PagesAdminStore(),
};

const primaryMenu = [
  {
    order: 300,
    icon: React.createElement(Icon, { icon: 'file' }),
    text: 'Pages',
    linkProps: {
      to: '/admin/pages',
    },
    acl: 'admin.pages.view',
  },
];

export { routes, stores, primaryMenu };
