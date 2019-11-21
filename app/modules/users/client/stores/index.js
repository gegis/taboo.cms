import AuthStore from './AuthStore';
import UsersStore from './UsersStore';
import UsersAdminStore from './UsersAdminStore';

const stores = {
  authStore: new AuthStore(),
  usersAdminStore: new UsersAdminStore(),
  usersStore: new UsersStore(),
};

export { stores };
