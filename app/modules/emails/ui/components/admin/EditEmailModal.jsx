import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/ui/components/admin/Modal';
import EmailForm from './EmailForm';

class EditEmailModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.emailsStore = props.emailsStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open(id) {
    this.emailsStore.resetItem();
    this.emailsStore.loadById(id).then(() => {
      this.modal.current.open();
    });
  }

  close() {
    this.emailsStore.resetItem();
    this.modal.current.close();
  }

  onSave() {
    const { item } = this.emailsStore;
    this.emailsStore.update(item).then(data => {
      this.notificationsStore.push({
        title: 'Success',
        html: 'Successfully updated {item}',
        translationVars: { item: data._id },
        translate: true,
      });
      this.emailsStore.resetItem();
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
        title="Edit Email"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Update"
      >
        <EmailForm />
      </Modal>
    );
  }
}

EditEmailModal.propTypes = {
  emailsStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('emailsStore', 'notificationsStore'), observer);

export default enhance(EditEmailModal);
