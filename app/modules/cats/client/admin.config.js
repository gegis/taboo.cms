import React from 'react';
import { Icon } from 'rsuite';

import Cats from './components/admin/Cats';
import CatsAdminStore from './stores/CatsAdminStore';

const enabled = true;

const routes = [
  {
    path: '/admin/cats',
    exact: true,
    component: Cats,
    admin: true,
  },
];

const stores = {
  catsStore: CatsAdminStore,
};

const primaryMenu = [
  {
    order: 200,
    icon: React.createElement(Icon, { icon: 'file-o' }),
    text: 'Cats',
    linkProps: {
      to: '/admin/cats',
    },
    acl: 'admin.cats.view',
  },
];

export { enabled, routes, stores, primaryMenu };
