import AbstractAdminStore from 'modules/core/ui/stores/AbstractAdminStore';
import { decorate, observable } from 'mobx';

const { language = 'en' } = window.app.config;

const newItem = {
  id: '',
  action: '',
  language: language,
  from: '',
  subject: '',
  body: '',
};

const actions = [
  {
    name: 'accountVerification',
    title: 'Account Verification',
    variables: ['{{email}}', '{{firstName}}', '{{lastName}}', '{{verifyLink}}'],
  },
  {
    name: 'passwordReset',
    title: 'Password Reset',
    variables: ['{{email}}', '{{firstName}}', '{{lastName}}', '{{resetLink}}'],
  },
  {
    name: 'deactivatedAccount',
    title: 'Deactivated Account',
    variables: ['{{email}}', '{{firstName}}', '{{lastName}}'],
  },
];

class EmailsAdminStore extends AbstractAdminStore {
  constructor() {
    super({
      newItem: newItem,
      endpoints: {
        loadAll: {
          method: 'get',
          path: '/api/admin/emails',
        },
        loadById: {
          method: 'get',
          path: '/api/admin/emails/:id',
        },
        create: {
          method: 'post',
          path: '/api/admin/emails',
        },
        update: {
          method: 'put',
          path: '/api/admin/emails/:id',
        },
        deleteById: {
          method: 'delete',
          path: '/api/admin/emails/:id',
        },
      },
    });
    this.actions = actions;
    this.actionsOptions = [];
    this.actions.map(action => {
      this.actionsOptions.push({
        label: action.title,
        value: action.name,
      });
    });
  }
}

decorate(EmailsAdminStore, {
  actions: observable,
  actionsOptions: observable,
});

export default new EmailsAdminStore();
