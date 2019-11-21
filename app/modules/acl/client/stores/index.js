import RolesStore from './RolesStore';
import ACLStore from './ACLStore';

const stores = {
  rolesStore: new RolesStore(),
  aclStore: new ACLStore(),
};

export { stores };
