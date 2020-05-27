import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/ui/components/admin/Modal';

import RoleForm from './RoleForm';

class EditRoleModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.aclStore = props.aclStore;
    this.rolesStore = props.rolesStore;
    this.localeStore = props.localeStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open(id) {
    this.rolesStore.resetItem();
    this.aclStore.loadAllResources().then(resources => {
      this.rolesStore.loadById(id, resources);
      this.modal.current.open();
    });
  }

  close() {
    this.rolesStore.resetItem();
    this.modal.current.close();
  }

  onSave() {
    this.rolesStore.update(this.rolesStore.item).then(data => {
      this.notificationsStore.push({
        title: this.localeStore.getTranslation('Success'),
        html: this.localeStore.getTranslation('Successfully updated {item}', { item: data.name }),
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
        title="Edit Role"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Update"
      >
        <RoleForm />
      </Modal>
    );
  }
}

EditRoleModal.propTypes = {
  aclStore: PropTypes.object.isRequired,
  rolesStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('aclStore', 'rolesStore', 'localeStore', 'notificationsStore'), observer);

export default enhance(EditRoleModal);
