import CatsStore from './stores/CatsStore';
import Cats from './components/Cats';

const enabled = true;

const routes = [
  {
    path: '/cats',
    exact: true,
    component: Cats,
    authorised: true,
    order: 1,
  },
];

const stores = {
  catsStore: CatsStore,
};

export { enabled, routes, stores };
