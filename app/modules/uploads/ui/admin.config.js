import React from 'react';
import { Icon } from 'rsuite';

import Uploads from './components/admin/Uploads';
import UploadsAdminStore from './stores/UploadsAdminStore';

const enabled = true;

const routes = [
  {
    path: '/admin/uploads',
    exact: true,
    component: Uploads,
    admin: true,
  },
];

const stores = {
  uploadsAdminStore: UploadsAdminStore,
};

const primaryMenu = [
  {
    order: 900,
    icon: React.createElement(Icon, { icon: 'file-upload' }),
    text: 'Uploads',
    linkProps: {
      to: '/admin/uploads',
    },
    acl: 'admin.uploads.view',
  },
];

export { enabled, routes, stores, primaryMenu };
