import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ResetPassword from './components/ResetPassword';
import ChangePassword from './components/ChangePassword';
import MyProfile from './components/MyProfile';
import AccountVerification from './components/AccountVerification';

import { stores as usersStores } from './stores';

const stores = {
  authStore: usersStores.authStore,
  usersStore: usersStores.usersStore,
};

const routes = [
  {
    path: '/sign-in',
    exact: true,
    component: SignIn,
    authorised: false,
  },
  {
    path: '/sign-up',
    exact: true,
    component: SignUp,
    authorised: false,
  },
  {
    path: '/reset-password',
    exact: true,
    component: ResetPassword,
    authorised: false,
  },
  {
    path: '/change-password/:userId/:token',
    exact: true,
    component: ChangePassword,
    authorised: false,
  },
  {
    path: '/my-profile',
    exact: true,
    component: MyProfile,
    authorised: true,
  },
  {
    path: '/account-verify',
    exact: true,
    component: AccountVerification,
    authorised: true,
  },
];

export { stores, routes };
