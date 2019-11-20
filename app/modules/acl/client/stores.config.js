import RolesStore from './stores/RolesStore';
import ACLStore from './stores/ACLStore';

const stores = {
  rolesStore: new RolesStore(),
  aclStore: new ACLStore(),
};

export { stores };
