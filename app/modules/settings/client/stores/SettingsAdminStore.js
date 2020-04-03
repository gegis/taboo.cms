import EntityAdminStore from 'modules/core/client/stores/EntityAdminStore';

const newItem = {
  id: null,
  name: '',
  enabled: false,
};

class SettingsAdminStore extends EntityAdminStore {
  constructor() {
    super({
      newItem: newItem,
      endpoints: {
        loadAll: {
          method: 'get',
          path: '/api/admin/settings',
        },
        loadById: {
          method: 'get',
          path: '/api/admin/settings/:id',
        },
        create: {
          method: 'post',
          path: '/api/admin/settings',
        },
        update: {
          method: 'put',
          path: '/api/admin/settings/:id',
        },
        deleteById: {
          method: 'delete',
          path: '/api/admin/settings/:id',
        },
      },
    });
  }
}

export default new SettingsAdminStore();
