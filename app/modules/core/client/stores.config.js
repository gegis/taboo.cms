import { RouterStore } from 'mobx-react-router';
import LocaleStore from './stores/LocaleStore';
import SettingsStore from './stores/SettingsStore';
import NotificationsStore from './stores/NotificationsStore';

const stores = {
  routerStore: new RouterStore(),
  settingsStore: new SettingsStore(),
  notificationsStore: new NotificationsStore(),
  localeStore: new LocaleStore(),
};

export { stores };
