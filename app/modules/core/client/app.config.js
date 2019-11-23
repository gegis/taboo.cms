import IndexPage from './components/IndexPage';

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
  {
    path: '/',
    exact: true,
    component: IndexPage,
    authorised: false,
  },
];

export { enabled, routes, stores };
