import { RouterStore } from 'mobx-react-router';
import LocaleStore from './LocaleStore';
import SettingsStore from './SettingsStore';
import NotificationsStore from './NotificationsStore';

const stores = {
  routerStore: new RouterStore(),
  settingsStore: new SettingsStore(),
  notificationsStore: new NotificationsStore(),
  localeStore: new LocaleStore(),
};

export { stores };
