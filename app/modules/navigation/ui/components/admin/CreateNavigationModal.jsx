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
    this.navigationStore = props.navigationStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open() {
    this.navigationStore.resetItem();
    this.modal.current.open();
  }

  close() {
    this.navigationStore.resetItem();
    this.modal.current.close();
  }

  onSave() {
    const { item } = this.navigationStore;
    this.navigationStore.create(item).then(data => {
      this.notificationsStore.push({
        title: 'Success',
        html: 'Successfully created {item}',
        translationVars: { item: data._id },
        translate: true,
      });
      this.navigationStore.resetItem();
      this.navigationStore.loadAll();
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
  navigationStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('navigationStore', 'notificationsStore'), observer);

export default enhance(CreateNavigationModal);
