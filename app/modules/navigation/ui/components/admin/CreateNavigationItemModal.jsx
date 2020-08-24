import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/ui/components/admin/Modal';

import NavigationItemForm from './NavigationItemForm';

class CreateNavigationItemModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.navigationAdminStore = props.navigationAdminStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open() {
    this.navigationAdminStore.resetNavigationItem();
    this.modal.current.open();
  }

  close() {
    this.navigationAdminStore.resetNavigationItem();
    this.modal.current.close();
  }

  onSave() {
    const { navigationItem } = this.navigationAdminStore;
    this.navigationAdminStore.addNewNavigationItem(navigationItem);
    this.navigationAdminStore.resetNavigationItem();
    this.close();
  }

  render() {
    return (
      <Modal
        full
        keyboard={false}
        backdrop="static"
        className="use-max-width"
        title="Create New Navigation Item"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Create"
      >
        <NavigationItemForm />
      </Modal>
    );
  }
}

CreateNavigationItemModal.propTypes = {
  navigationAdminStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('navigationAdminStore'), observer);

export default enhance(CreateNavigationItemModal);
