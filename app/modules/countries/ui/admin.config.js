import React from 'react';
import { Icon } from 'rsuite';

import Countries from './components/admin/Countries';
import CountriesAdminStore from './stores/CountriesAdminStore';
import CountriesStore from './stores/CountriesStore';

const enabled = true;

const routes = [
  {
    path: '/admin/countries',
    exact: true,
    component: Countries,
    admin: true,
  },
];

const stores = {
  countriesAdminStore: CountriesAdminStore,
  countriesStore: CountriesStore,
};

const primaryMenu = [
  {
    text: 'Casino Settings',
    order: 200,
    icon: React.createElement(Icon, { icon: 'cog' }),
    acl: 'admin.casinoDetails.view',
    dropdown: [
      {
        order: 80,
        icon: React.createElement(Icon, { icon: 'globe' }),
        text: 'Countries',
        linkProps: {
          to: '/admin/countries',
        },
        acl: 'admin.countries.view',
      },
    ],
  },
];

export { enabled, routes, stores, primaryMenu };
