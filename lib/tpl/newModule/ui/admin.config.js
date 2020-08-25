import React from 'react';
import { Icon } from 'rsuite';

import ModuleName from './components/admin/ModuleName';
import ModuleNameAdminStore from './stores/ModuleNameAdminStore';

const enabled = true;

const routes = [
  {
    path: '/admin/moduleName',
    exact: true,
    component: ModuleName,
    admin: true,
  },
];

const stores = {
  moduleNameAdminStore: ModuleNameAdminStore,
};

const primaryMenu = [
  {
    order: 200,
    icon: React.createElement(Icon, { icon: 'file-o' }),
    name: 'ModuleName',
    linkProps: {
      to: '/admin/moduleName',
    },
    acl: 'admin.moduleName.view',
  },
];

export { enabled, routes, stores, primaryMenu };
