import UploadsStore from './stores/UploadsStore';
import ImagePreview from './components/ImagePreview';

const enabled = true;

const routes = [
  {
    path: '/user-files/image/*',
    exact: true,
    component: ImagePreview,
    authorised: true,
    order: 1,
  },
];

const stores = {
  uploadsStore: UploadsStore,
};

export { enabled, routes, stores };
