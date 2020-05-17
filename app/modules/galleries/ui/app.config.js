import GalleriesStore from './stores/GalleriesStore';
import GalleryPageBlock from './components/GalleryPageBlock';

const enabled = true;

const stores = {
  galleriesStore: GalleriesStore,
};

const pageBlocks = [
  {
    name: 'Gallery',
    displayComponent: GalleryPageBlock,
  },
];

export { enabled, stores, pageBlocks };
