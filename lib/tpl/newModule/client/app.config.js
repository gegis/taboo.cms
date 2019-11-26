import ModuleNameStore from './stores/ModuleNameStore';
import ModuleName from './components/ModuleName';

const enabled = true;

const routes = [
  {
    path: '/moduleName',
    exact: true,
    component: ModuleName,
    authorised: true,
    order: 1,
  },
];

const stores = {
  moduleNameStore: ModuleNameStore,
};

export { enabled, routes, stores };
