import React from 'react';
import { Button } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/ui/components/admin/Modal';
import PageForm from './PageForm';
import Translation from 'app/modules/core/ui/components/Translation';

class EditPageModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.pagesAdminStore = props.pagesAdminStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
    this.loadPreviousVersion = this.loadPreviousVersion.bind(this);
  }

  open(id) {
    this.pagesAdminStore.resetItem();
    this.pagesAdminStore.loadById(id).then(() => {
      this.modal.current.open();
    });
  }

  close() {
    this.pagesAdminStore.resetItem();
    this.modal.current.close();
  }

  onSave() {
    const { item } = this.pagesAdminStore;
    const page = Object.assign({}, item);
    this.pagesAdminStore.update(page).then(data => {
      this.notificationsStore.push({
        title: 'Success',
        html: 'Successfully updated {item}',
        translationVars: { item: data.title },
        translate: true,
      });
      this.close();
    });
  }

  loadPreviousVersion() {
    this.pagesAdminStore.loadPreviousVersion();
  }

  getCustomButton() {
    return (
      <Button appearance="ghost" onClick={this.loadPreviousVersion}>
        <Translation message="Restore Previous Version" />
      </Button>
    );
  }

  render() {
    return (
      <Modal
        full
        keyboard={false}
        backdrop="static"
        title="Edit Page"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Update"
        customButtons={this.getCustomButton()}
      >
        <PageForm />
      </Modal>
    );
  }
}

EditPageModal.propTypes = {
  pagesAdminStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('pagesAdminStore', 'notificationsStore'), observer);

export default enhance(EditPageModal);
