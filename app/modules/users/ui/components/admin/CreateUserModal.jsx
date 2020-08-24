import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/ui/components/admin/Modal';

import UserForm from './UserForm';

class CreateUserModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.usersAdminStore = props.usersAdminStore;
    this.notificationsStore = props.notificationsStore;
    this.aclStore = props.aclStore;
    this.rolesStore = props.rolesStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open() {
    this.usersAdminStore.resetItem();
    if (this.aclStore.isAllowed(this.aclStore.userACL, 'admin.acl.view')) {
      this.rolesStore.loadAllRolesForSelection().then(() => {
        this.modal.current.open();
      });
    } else {
      this.modal.current.open();
    }
  }

  close() {
    this.modal.current.close();
  }

  onSave() {
    const { item } = this.usersAdminStore;
    this.usersAdminStore.create(item).then(data => {
      this.notificationsStore.push({
        title: 'Success',
        html: 'Successfully created {item}',
        translationVars: { item: data.email },
        translate: true,
      });
      this.usersAdminStore.resetItem();
      this.usersAdminStore.loadAll();
      this.close();
    });
  }

  render() {
    return (
      <Modal
        full
        backdrop="static"
        className="use-max-width"
        title="Create User"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Create"
      >
        <UserForm />
      </Modal>
    );
  }
}

CreateUserModal.propTypes = {
  usersAdminStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
  aclStore: PropTypes.object.isRequired,
  rolesStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('usersAdminStore', 'notificationsStore', 'aclStore', 'rolesStore'), observer);

export default enhance(CreateUserModal);
