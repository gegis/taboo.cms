import TemplatesStore from './stores/TemplatesStore';
import TemplatePreview from './components/TemplatePreview';

const enabled = true;

const routes = [
  {
    path: '/:language?/templates/preview/:template',
    exact: true,
    component: TemplatePreview,
    authorised: true,
    order: 1,
  },
];

const stores = {
  templatesStore: TemplatesStore,
};

export { enabled, routes, stores };
