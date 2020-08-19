import React from 'react';
import { Icon } from 'rsuite';

import Forms from './components/admin/Forms';
import FormsAdminStore from './stores/FormsAdminStore';
import FormsStore from './stores/FormsStore';
import FormPageBlockPreview from 'modules/forms/ui/components/admin/FormPageBlockPreview';
import FormPageBlockActions from 'modules/forms/ui/components/admin/FormPageBlockActions';

const enabled = true;

const routes = [
  {
    path: '/admin/forms',
    exact: true,
    component: Forms,
    admin: true,
  },
];

const stores = {
  formsAdminStore: FormsAdminStore,
  formsStore: FormsStore,
};

const primaryMenu = [
  {
    order: 350,
    icon: React.createElement(Icon, { icon: 'frame' }),
    text: 'Forms',
    linkProps: {
      to: '/admin/forms',
    },
    acl: 'admin.forms.view',
  },
];

const pageBlocks = [
  {
    name: 'Form',
    props: {
      formId: '',
    },
    template: {
      path: '/modules/forms/views/formPageBlock',
      beforeRenderService: 'modules/forms/services/FormsService',
      beforeRenderMethod: 'beforeFormRender',
    },
    order: 350,
    icon: React.createElement(Icon, { icon: 'frame' }),
    previewComponent: FormPageBlockPreview,
    actionsComponent: FormPageBlockActions,
  },
];

export { enabled, routes, stores, primaryMenu, pageBlocks };
