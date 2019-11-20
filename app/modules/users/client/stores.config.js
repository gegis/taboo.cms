import AuthStore from './stores/AuthStore';
import UsersStore from './stores/UsersStore';
import UsersAdminStore from './stores/UsersAdminStore';

const stores = {
  authStore: new AuthStore(),
  usersAdminStore: new UsersAdminStore(),
  usersStore: new UsersStore(),
};

export { stores };
