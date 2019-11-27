// import IndexPage from './components/IndexPage';
import Dashboard from './components/Dashboard';

import RouterStore from './stores/RouterStore';
import SettingsStore from './stores/SettingsStore';
import NotificationsStore from './stores/NotificationsStore';
import LocaleStore from './stores/LocaleStore';

const enabled = true;

const stores = {
  routerStore: RouterStore,
  settingsStore: SettingsStore,
  notificationsStore: NotificationsStore,
  localeStore: LocaleStore,
};

const routes = [
  // ATM it is served as dynamic page.
  // {
  //   path: '/',
  //   exact: true,
  //   component: IndexPage,
  //   authorised: false,
  // },
  {
    path: '/dashboard',
    exact: true,
    component: Dashboard,
    authorised: true,
  },
];

export { enabled, routes, stores };
