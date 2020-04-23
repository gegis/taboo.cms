import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ListPage from 'modules/core/ui/components/admin/ListPage';
import UsersList from './UsersList';
import CreateModal from './CreateUserModal';
import EditModal from './EditUserModal';

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.entityStore = props.usersStore;
  }

  render() {
    return (
      <ListPage
        name="Users"
        entityStore={this.entityStore}
        ItemsListComponent={UsersList}
        CreateModalComponent={CreateModal}
        EditModalComponent={EditModal}
      />
    );
  }
}

Users.propTypes = {
  usersStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('usersStore'), observer);

export default enhance(Users);
