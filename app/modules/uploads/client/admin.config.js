import React from 'react';
import { Icon } from 'rsuite';

import Uploads from './components/admin/Uploads';
import UploadsAdminStore from './stores/UploadsAdminStore';

const routes = [
  {
    path: '/admin/uploads',
    exact: true,
    component: Uploads,
    admin: true,
  },
];

const stores = {
  uploadsStore: new UploadsAdminStore(),
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

export { routes, stores, primaryMenu };
