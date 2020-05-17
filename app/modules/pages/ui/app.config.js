import PagesStore from './stores/PagesStore';
import Page from './components/Page';
import HtmlPageBlock from './components/HtmlPageBlock';

const enabled = true;

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
  pagesStore: PagesStore,
};

const pageBlocks = [
  {
    name: 'HTML',
    displayComponent: HtmlPageBlock,
  },
];

export { enabled, routes, stores, pageBlocks };
