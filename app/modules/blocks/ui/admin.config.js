import React from 'react';
import { Icon } from 'rsuite';

import Blocks from './components/admin/Blocks';
import BlocksAdminStore from './stores/BlocksAdminStore';

const enabled = true;

const routes = [
  {
    path: '/admin/blocks',
    exact: true,
    component: Blocks,
    admin: true,
  },
];

const stores = {
  blocksStore: BlocksAdminStore,
};

const primaryMenu = [
  {
    order: 325,
    icon: React.createElement(Icon, { icon: 'th' }),
    text: 'Blocks',
    linkProps: {
      to: '/admin/blocks',
    },
    acl: 'admin.blocks.view',
  },
];

export { enabled, routes, stores, primaryMenu };
