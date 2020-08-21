import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/ui/components/admin/Modal';
import UserForm from './UserForm';

class EditUserModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.usersStore = props.usersStore;
    this.notificationsStore = props.notificationsStore;
    this.aclStore = props.aclStore;
    this.rolesStore = props.rolesStore;
    this.uiAdminStore = props.uiAdminStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open(id) {
    this.usersStore.resetItem();
    this.usersStore.loadById(id).then(() => {
      if (this.aclStore.isAllowed(this.aclStore.userACL, 'admin.acl.view')) {
        this.rolesStore.loadAllRolesForSelection().then(() => {
          this.modal.current.open();
        });
      } else {
        this.modal.current.open();
      }
    });
  }

  close() {
    const { search = '', filter = null } = this.usersStore;
    this.uiAdminStore.setLoading(true);
    this.usersStore.loadAll({ search, filter }).then(() => {
      this.uiAdminStore.setLoading(false);
    });
    this.usersStore.resetItem();
    this.modal.current.close();
  }

  onSave() {
    const { item } = this.usersStore;
    this.usersStore.update(item).then(data => {
      this.notificationsStore.push({
        title: 'Success',
        html: 'Successfully updated {item}',
        translationVars: { item: data.email },
        translate: true,
      });
      this.close();
    });
  }

  render() {
    return (
      <Modal
        full
        backdrop="static"
        className="use-max-width"
        title="Edit User"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Update"
      >
        <UserForm />
      </Modal>
    );
  }
}

EditUserModal.propTypes = {
  usersStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
  aclStore: PropTypes.object.isRequired,
  rolesStore: PropTypes.object.isRequired,
  uiAdminStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('usersStore', 'notificationsStore', 'aclStore', 'rolesStore', 'uiAdminStore'), observer);

export default enhance(EditUserModal);
