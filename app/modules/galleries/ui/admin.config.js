import React from 'react';
import { Icon } from 'rsuite';

import Galleries from './components/admin/Galleries';
import GalleriesStore from './stores/GalleriesStore';
import GalleriesAdminStore from './stores/GalleriesAdminStore';
import GalleryPageBlockPreview from './components/admin/GalleryPageBlockPreview';
import GalleryPageBlockActions from './components/admin/GalleryPageBlockActions';

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
  galleriesAdminStore: GalleriesAdminStore,
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

const pageBlocks = [
  {
    name: 'Gallery',
    props: {
      id: '',
    },
    order: 100,
    icon: React.createElement(Icon, { icon: 'file-image-o' }),
    previewComponent: GalleryPageBlockPreview,
    actionsComponent: GalleryPageBlockActions,
  },
];

export { enabled, routes, stores, primaryMenu, pageBlocks };
