import EntityAdminStore from 'modules/core/client/stores/EntityAdminStore';

const newItem = {
  id: null,
  todo: '',
};

class ModuleNameAdminStore extends EntityAdminStore {
  constructor() {
    super({
      newItem: newItem,
      endpoints: {
        loadAll: {
          method: 'get',
          path: '/api/admin/moduleName',
        },
        loadById: {
          method: 'get',
          path: '/api/admin/moduleName/:id',
        },
        create: {
          method: 'post',
          path: '/api/admin/moduleName',
        },
        update: {
          method: 'put',
          path: '/api/admin/moduleName/:id',
        },
        deleteById: {
          method: 'delete',
          path: '/api/admin/moduleName/:id',
        },
      },
    });
  }
}

export default new ModuleNameAdminStore();
