import React from 'react';
import { Icon } from 'rsuite';

import Galleries from './components/admin/Galleries';
import GalleriesAdminStore from './stores/GalleriesAdminStore';
import GalleryPageBlockConfig from './components/admin/GalleryPageBlockConfig';
import GalleryPageBlock from './components/GalleryPageBlock';

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
  galleriesStore: GalleriesAdminStore,
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
    configComponent: GalleryPageBlockConfig,
    displayComponent: GalleryPageBlock,
  },
];

export { enabled, routes, stores, primaryMenu, pageBlocks };
