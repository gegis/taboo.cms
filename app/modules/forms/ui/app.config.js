import FormsStore from './stores/FormsStore';
import FormPageBlock from 'modules/forms/ui/components/FormPageBlock';
import ContactUsTemplate from 'modules/forms/ui/components/formTemplates/ContactUsTemplate';

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

const config = {
  formComponents: {
    contactUs: ContactUsTemplate,
  },
};

export { enabled, pageBlocks, stores, config };
