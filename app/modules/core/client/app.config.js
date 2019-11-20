import { stores } from './stores.config';
import IndexPage from './components/IndexPage';

const routes = [
  {
    path: '/',
    exact: true,
    component: IndexPage,
    authorised: false,
  },
];

export { routes, stores };
