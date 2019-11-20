import PagesStore from './stores/PagesStore';
import Page from './components/Page';

const routes = [
  {
    path: '/*',
    exact: true,
    component: Page,
    authorised: false,
    order: 20000,
  },
];

const stores = {
  pagesStore: new PagesStore(),
};

export { routes, stores };
