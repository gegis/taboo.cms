import AbstractAdminStore from 'modules/core/client/stores/AbstractAdminStore';

const newItem = {
  id: null,
  name: '',
  enabled: false,
};

class CatsAdminStore extends AbstractAdminStore {
  constructor() {
    super({
      newItem: newItem,
      endpoints: {
        loadAll: {
          method: 'get',
          path: '/api/admin/cats',
        },
        loadById: {
          method: 'get',
          path: '/api/admin/cats/:id',
        },
        create: {
          method: 'post',
          path: '/api/admin/cats',
        },
        update: {
          method: 'put',
          path: '/api/admin/cats/:id',
        },
        deleteById: {
          method: 'delete',
          path: '/api/admin/cats/:id',
        },
      },
    });
  }
}

export default new CatsAdminStore();
