import React from 'react';
import { Notification } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/client/components/admin/Modal';
import RoleForm from './RoleForm';

class CreateRoleModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.aclStore = props.aclStore;
    this.rolesStore = props.rolesStore;
    this.localeStore = props.localeStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open() {
    this.aclStore.loadAllResources().then(() => {
      this.rolesStore.resetItem();
      this.modal.current.open();
    });
  }

  close() {
    this.rolesStore.resetItem();
    this.modal.current.close();
  }

  getSuccessMessage(data) {
    return {
      __html: this.localeStore.getTranslation('Successfully created {item}', { item: data.name }),
    };
  }

  onSave() {
    this.rolesStore.create(this.rolesStore.item).then(data => {
      Notification.open({
        title: 'Message',
        description: <span dangerouslySetInnerHTML={this.getSuccessMessage(data)} />,
        duration: 5000,
      });
      this.rolesStore.resetItem();
      this.rolesStore.loadAll();
      this.close();
    });
  }

  render() {
    return (
      <Modal
        full
        backdrop="static"
        className="use-max-width"
        title="Create New Role"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Create"
      >
        <RoleForm />
      </Modal>
    );
  }
}

CreateRoleModal.propTypes = {
  aclStore: PropTypes.object.isRequired,
  rolesStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
};

const enhance = compose(
  inject('aclStore', 'rolesStore', 'localeStore'),
  observer
);

export default enhance(CreateRoleModal);
