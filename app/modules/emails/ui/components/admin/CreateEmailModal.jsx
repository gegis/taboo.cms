import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/ui/components/admin/Modal';

import EmailForm from './EmailForm';

class CreateEmailModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.emailsAdminStore = props.emailsAdminStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open() {
    this.emailsAdminStore.resetItem();
    this.modal.current.open();
  }

  close() {
    this.emailsAdminStore.resetItem();
    this.modal.current.close();
  }

  onSave() {
    const { item } = this.emailsAdminStore;
    this.emailsAdminStore.create(item).then(data => {
      this.notificationsStore.push({
        title: 'Success',
        html: 'Successfully created {item}',
        translationVars: { item: data._id },
        translate: true,
      });
      this.emailsAdminStore.resetItem();
      this.emailsAdminStore.loadAll();
      this.close();
    });
  }

  render() {
    return (
      <Modal
        full
        keyboard={false}
        backdrop="static"
        className="use-max-width"
        title="Create New Email"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Create"
      >
        <EmailForm />
      </Modal>
    );
  }
}

CreateEmailModal.propTypes = {
  emailsAdminStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('emailsAdminStore', 'notificationsStore'), observer);

export default enhance(CreateEmailModal);
