import FormsStore from './stores/FormsStore';
import FormPageBlock from 'modules/forms/ui/components/FormPageBlock';

const enabled = true;

const stores = {
  formsStore: FormsStore,
};

const pageBlocks = [
  {
    name: 'Form',
    displayComponent: FormPageBlock,
  },
];

export { enabled, pageBlocks, stores };
