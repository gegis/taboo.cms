import React from 'react';
import { Icon } from 'rsuite';

import Emails from './components/admin/Emails';
import EmailsAdminStore from './stores/EmailsAdminStore';

const enabled = true;

const routes = [
  {
    path: '/admin/emails',
    exact: true,
    component: Emails,
    admin: true,
  },
];

const stores = {
  emailsAdminStore: EmailsAdminStore,
};

const primaryMenu = [
  {
    order: 360,
    icon: React.createElement(Icon, { icon: 'envelope-o' }),
    name: 'Emails',
    linkProps: {
      to: '/admin/emails',
    },
    acl: 'admin.emails.view',
  },
];

export { enabled, routes, stores, primaryMenu };
