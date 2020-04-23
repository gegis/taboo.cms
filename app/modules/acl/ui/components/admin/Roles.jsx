import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import RolesList from 'app/modules/acl/ui/components/admin/RolesList';
import CreateRoleModal from 'app/modules/acl/ui/components/admin/CreateRoleModal';
import EditRoleModal from 'app/modules/acl/ui/components/admin/EditRoleModal';
import ListPage from 'app/modules/core/ui/components/admin/ListPage';

class Roles extends React.Component {
  constructor(props) {
    super(props);
    this.rolesStore = props.rolesStore;
  }

  render() {
    return (
      <ListPage
        name="User Roles"
        entityStore={this.rolesStore}
        ItemsListComponent={RolesList}
        CreateModalComponent={CreateRoleModal}
        EditModalComponent={EditRoleModal}
      />
    );
  }
}

Roles.propTypes = {
  rolesStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('rolesStore'), observer);

export default enhance(Roles);
