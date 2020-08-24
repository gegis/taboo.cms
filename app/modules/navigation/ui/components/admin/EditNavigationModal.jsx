import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/ui/components/admin/Modal';
import NavigationForm from './NavigationForm';

class EditNavigationModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.navigationAdminStore = props.navigationAdminStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open(id) {
    this.navigationAdminStore.resetItem();
    this.navigationAdminStore.loadById(id).then(() => {
      this.modal.current.open();
    });
  }

  close() {
    this.navigationAdminStore.resetItem();
    this.modal.current.close();
  }

  onSave() {
    const { item } = this.navigationAdminStore;
    this.navigationAdminStore.update(item).then(data => {
      this.notificationsStore.push({
        title: 'Success',
        html: 'Successfully updated {item}',
        translationVars: { item: data._id },
        translate: true,
      });
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
        title="Edit Navigation"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Update"
      >
        <NavigationForm />
      </Modal>
    );
  }
}

EditNavigationModal.propTypes = {
  navigationAdminStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('navigationAdminStore', 'notificationsStore'), observer);

export default enhance(EditNavigationModal);
