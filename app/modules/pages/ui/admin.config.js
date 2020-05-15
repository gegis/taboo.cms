import React from 'react';
import { Icon } from 'rsuite';

import Pages from './components/admin/Pages';
import PagesAdminStore from './stores/PagesAdminStore';
import HtmlPageBlockPreview from 'modules/pages/ui/components/admin/HtmlPageBlockPreview';
import HtmlPageBlockActions from 'modules/pages/ui/components/admin/HtmlPageBlockActions';

const enabled = true;

const routes = [
  {
    path: '/admin/pages',
    exact: true,
    component: Pages,
    admin: true,
  },
];

const stores = {
  pagesStore: PagesAdminStore,
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

const pageBlocks = [
  {
    name: 'HTML',
    props: {
      html: '',
    },
    order: 1000,
    icon: React.createElement(Icon, { icon: 'file-text-o' }),
    previewComponent: HtmlPageBlockPreview,
    actionsComponent: HtmlPageBlockActions,
  },
];

export { enabled, routes, stores, primaryMenu, pageBlocks };
