import React from 'react';
import { Icon } from 'rsuite';

import Galleries from './components/admin/Galleries';
import GalleriesStore from './stores/GalleriesStore';

const enabled = true;

const routes = [
  {
    path: '/admin/galleries',
    exact: true,
    component: Galleries,
    admin: true,
  },
];

const stores = {
  galleriesStore: GalleriesStore,
};

const primaryMenu = [
  {
    order: 350,
    icon: React.createElement(Icon, { icon: 'file-image-o' }),
    text: 'Galleries',
    linkProps: {
      to: '/admin/galleries',
    },
    acl: 'admin.galleries.view',
  },
];

export { enabled, routes, stores, primaryMenu };
