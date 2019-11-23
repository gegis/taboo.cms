import EntityAdminStore from 'app/modules/core/client/stores/EntityAdminStore';
import axios from 'axios';
import { action, decorate, observable, runInAction } from 'mobx';
import ResponseHelper from 'app/modules/core/client/helpers/ResponseHelper';

const newItem = {
  id: null,
  name: '',
  resources: [],
};

class RolesStore extends EntityAdminStore {
  constructor() {
    super({
      newItem: newItem,
      endpoints: {
        loadAll: {
          method: 'get',
          path: '/api/admin/acl/roles',
        },
        loadById: {
          method: 'get',
          path: '/api/admin/acl/roles/:id',
        },
        create: {
          method: 'post',
          path: '/api/admin/acl/roles',
        },
        update: {
          method: 'put',
          path: '/api/admin/acl/roles/:id',
        },
        deleteById: {
          method: 'delete',
          path: '/api/admin/acl/roles/:id',
        },
      },
    });
    this.allRolesForSelection = [];
  }

  loadById(id, allResources = []) {
    return new Promise(resolve => {
      const { loadById } = this.options.endpoints;
      axios[loadById.method](loadById.path.replace(':id', id))
        .then(response => {
          runInAction(() => {
            const { data = {} } = response;
            if (!data.id && data._id) {
              data.id = data._id;
            }
            this.parseDataRoleResources(data, allResources);
            this.item = data;
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  loadAllRolesForSelection() {
    return new Promise(resolve => {
      const opts = {
        params: {
          limit: 10000,
        },
      };
      axios
        .get('/api/admin/acl/roles', opts)
        .then(response => {
          runInAction(() => {
            const { data = [] } = response;
            if (data) {
              this.allRolesForSelection = [];
              data.map(item => {
                this.allRolesForSelection.push({ label: item.name, value: item._id });
              });
            }
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  /**
   * Parses current role resources against all, it's important to keep aligned with only existing resources
   * and remove the ones that don't exist anymore
   * @param data
   */
  parseDataRoleResources(data, allResources) {
    const roleResources = [];
    if (allResources && data.resources) {
      data.resources.map(resource => {
        if (allResources.indexOf(resource) !== -1) {
          roleResources.push(resource);
        }
      });
      data.resources = roleResources;
    }
  }
}

decorate(RolesStore, {
  allRolesForSelection: observable,
  loadById: action,
  loadAllRolesForSelection: action,
});

export default new RolesStore();
