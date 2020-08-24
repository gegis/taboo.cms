import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/ui/components/admin/Modal';

import NavigationForm from './NavigationForm';

class CreateNavigationModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.navigationAdminStore = props.navigationAdminStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open() {
    this.navigationAdminStore.resetItem();
    this.modal.current.open();
  }

  close() {
    this.navigationAdminStore.resetItem();
    this.modal.current.close();
  }

  onSave() {
    const { item } = this.navigationAdminStore;
    this.navigationAdminStore.create(item).then(data => {
      this.notificationsStore.push({
        title: 'Success',
        html: 'Successfully created {item}',
        translationVars: { item: data._id },
        translate: true,
      });
      this.navigationAdminStore.resetItem();
      this.navigationAdminStore.loadAll();
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
        title="Create New Navigation"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Create"
      >
        <NavigationForm />
      </Modal>
    );
  }
}

CreateNavigationModal.propTypes = {
  navigationAdminStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('navigationAdminStore', 'notificationsStore'), observer);

export default enhance(CreateNavigationModal);
