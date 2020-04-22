import AbstractAdminStore from 'modules/core/ui/stores/AbstractAdminStore';

const newItem = {
  id: '',
  action: '',
  token: '',
  user: '',
  code: '',
  error: '',
};

class LogsApiAdminStore extends AbstractAdminStore {
  constructor() {
    super({
      newItem: newItem,
      endpoints: {
        loadAll: {
          method: 'get',
          path: '/api/admin/logs/api',
        },
        loadById: {
          method: 'get',
          path: '/api/admin/logs/api/:id',
        },
        deleteById: {
          method: 'delete',
          path: '/api/admin/logs/api/:id',
        },
      },
    });
  }
}

export default new LogsApiAdminStore();
