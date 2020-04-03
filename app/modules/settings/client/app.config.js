import SettingsStore from './stores/SettingsStore';
import Settings from './components/Settings';

const enabled = true;

const routes = [
  {
    path: '/settings',
    exact: true,
    component: Settings,
    authorised: true,
    order: 1,
  },
];

const stores = {
  settingsStore: SettingsStore,
};

export { enabled, routes, stores };
