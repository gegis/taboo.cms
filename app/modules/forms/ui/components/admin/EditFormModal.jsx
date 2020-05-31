import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/ui/components/admin/Modal';
import FormForm from './FormForm';

class EditFormModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.formsAdminStore = props.formsAdminStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open(id) {
    this.formsAdminStore.resetItem();
    this.formsAdminStore.loadById(id).then(() => {
      this.modal.current.open();
    });
  }

  close() {
    this.formsAdminStore.resetItem();
    this.modal.current.close();
  }

  onSave() {
    const { item } = this.formsAdminStore;
    this.formsAdminStore.update(item).then(data => {
      this.notificationsStore.push({
        title: 'Success',
        html: 'Successfully updated {item}',
        translationVars: { item: data._id },
        translate: true,
      });
      this.formsAdminStore.resetItem();
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
        title="Edit Form"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Update"
      >
        <FormForm />
      </Modal>
    );
  }
}

EditFormModal.propTypes = {
  formsAdminStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('formsAdminStore', 'notificationsStore'), observer);

export default enhance(EditFormModal);
