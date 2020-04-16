import AbstractAdminStore from 'modules/core/client/stores/AbstractAdminStore';

const newItem = {
  id: '',
  name: '',
  body: '',
  type: '',
  layout: '',
  language: '',
  variables: '',
  enabled: true,
};

class BlocksAdminStore extends AbstractAdminStore {
  constructor() {
    super({
      newItem: newItem,
      endpoints: {
        loadAll: {
          method: 'get',
          path: '/api/admin/blocks',
        },
        loadById: {
          method: 'get',
          path: '/api/admin/blocks/:id',
        },
        create: {
          method: 'post',
          path: '/api/admin/blocks',
        },
        update: {
          method: 'put',
          path: '/api/admin/blocks/:id',
        },
        deleteById: {
          method: 'delete',
          path: '/api/admin/blocks/:id',
        },
      },
    });
  }
}

export default new BlocksAdminStore();
