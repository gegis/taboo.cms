import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/ui/components/admin/Modal';

import PageForm from './PageForm';

class CreatePageModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.pagesAdminStore = props.pagesAdminStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open() {
    this.pagesAdminStore.resetItem();
    this.modal.current.open();
  }

  close() {
    this.pagesAdminStore.resetItem();
    this.modal.current.close();
  }

  onSave() {
    const { item } = this.pagesAdminStore;
    const page = Object.assign({}, item);
    this.pagesAdminStore.create(page).then(data => {
      this.notificationsStore.push({
        title: 'Success',
        html: 'Successfully created {item}',
        translationVars: { item: data.title },
        translate: true,
      });
      this.pagesAdminStore.resetItem();
      this.pagesAdminStore.loadAll();
      this.close();
    });
  }

  render() {
    return (
      <Modal
        full
        keyboard={false}
        backdrop="static"
        title="Create New Page"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Create"
      >
        <PageForm />
      </Modal>
    );
  }
}

CreatePageModal.propTypes = {
  pagesAdminStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('pagesAdminStore', 'notificationsStore'), observer);

export default enhance(CreatePageModal);
