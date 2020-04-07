import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/client/components/admin/Modal';

import NavigationItemForm from './NavigationItemForm';

class EditNavigationItemModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.navigationStore = props.navigationStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open(row) {
    const { node } = row;
    this.navigationStore.setNavigationItem(node);
    this.navigationStore.setNavigationItemRow(row);
    this.modal.current.open();
  }

  close() {
    this.navigationStore.resetNavigationItem();
    this.modal.current.close();
  }

  onSave() {
    const { updateNavigationItem, navigationItem, navigationItemRow } = this.navigationStore;
    updateNavigationItem(navigationItem, navigationItemRow);
    this.notificationsStore.push({
      title: 'Success',
      html: 'Successfully updated {item}',
      translationVars: { item: navigationItem.title },
      translate: true,
    });
    this.close();
  }

  render() {
    return (
      <Modal
        full
        keyboard={false}
        backdrop="static"
        className="use-max-width"
        title="Update Navigation Item"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Update"
      >
        <NavigationItemForm />
      </Modal>
    );
  }
}

EditNavigationItemModal.propTypes = {
  navigationStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('navigationStore', 'notificationsStore'), observer);

export default enhance(EditNavigationItemModal);
