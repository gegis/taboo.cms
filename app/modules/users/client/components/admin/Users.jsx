import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ListPage from 'modules/core/client/components/admin/ListPage';
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

// class Users extends React.Component {
//   constructor(props) {
//     super(props);
//     this.aclStore = props.aclStore;
//     this.usersStore = props.usersStore;
//     this.rolesStore = props.rolesStore;
//     this.localeStore = props.localeStore;
//     this.settingsStore = props.settingsStore;
//     this.createModal = React.createRef();
//     this.editModal = React.createRef();
//   }
//
//   render() {
//     return (
//       <Layout className="users" headerNav={this.getHeaderNav()} pageTitle="Users" pageActions={this.getPageActions()}>
//         <Panel className="shadow">
//           {this.usersStore.users.length > 0 && (
//
//           )}
//           {this.usersStore.users.length > 0 && this.usersStore.hasMoreResults && this.getLoadMoreButton()}
//           {this.usersStore.users.length === 0 && (
//             <div className="">
//               <Translation message="No results found" />
//             </div>
//           )}
//         </Panel>
//         <CreateUser ref={this.createModal} />
//         <EditUser ref={this.editModal} />
//       </Layout>
//     );
//   }
// }
//
// Users.propTypes = {
//   aclStore: PropTypes.object.isRequired,
//   usersStore: PropTypes.object.isRequired,
//   rolesStore: PropTypes.object.isRequired,
//   localeStore: PropTypes.object.isRequired,
//   settingsStore: PropTypes.object.isRequired,
// };
//
// const enhance = compose(
//   inject('aclStore', 'usersStore', 'rolesStore', 'localeStore', 'settingsStore'),
//   observer
// );
//
// export default enhance(Users);
