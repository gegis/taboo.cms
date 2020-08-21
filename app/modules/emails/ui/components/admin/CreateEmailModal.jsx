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
    this.emailsStore = props.emailsStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open() {
    this.emailsStore.resetItem();
    this.modal.current.open();
  }

  close() {
    this.emailsStore.resetItem();
    this.modal.current.close();
  }

  onSave() {
    const { item } = this.emailsStore;
    this.emailsStore.create(item).then(data => {
      this.notificationsStore.push({
        title: 'Success',
        html: 'Successfully created {item}',
        translationVars: { item: data._id },
        translate: true,
      });
      this.emailsStore.resetItem();
      this.emailsStore.loadAll();
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
  emailsStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('emailsStore', 'notificationsStore'), observer);

export default enhance(CreateEmailModal);
