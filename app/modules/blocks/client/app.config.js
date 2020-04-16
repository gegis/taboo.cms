import BlocksStore from './stores/BlocksStore';
import Blocks from './components/Blocks';

const enabled = true;

const routes = [
  {
    path: '/blocks',
    exact: true,
    component: Blocks,
    authorised: true,
    order: 1,
  },
];

const stores = {
  blocksStore: BlocksStore,
};

export { enabled, routes, stores };
