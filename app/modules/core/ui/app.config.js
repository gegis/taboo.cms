// import IndexPage from './components/IndexPage';
import Dashboard from './components/Dashboard';

import RouterStore from './stores/RouterStore';
import NotificationsStore from './stores/NotificationsStore';
import LocaleStore from './stores/LocaleStore';
import UIStore from 'modules/core/ui/stores/UIStore';

const enabled = true;

const stores = {
  routerStore: RouterStore,
  uiStore: UIStore,
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
