import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/ui/components/admin/Modal';

import GalleryForm from './GalleryForm';

class CreateGalleryModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.galleriesStore = props.galleriesStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open() {
    this.galleriesStore.resetItem();
    this.modal.current.open();
  }

  close() {
    this.galleriesStore.resetItem();
    this.modal.current.close();
  }

  onSave() {
    const { item } = this.galleriesStore;
    this.galleriesStore.create(item).then(data => {
      this.notificationsStore.push({
        html: 'Successfully created {item}',
        translationVars: { item: data.title },
        translate: true,
      });
      this.galleriesStore.resetItem();
      this.galleriesStore.loadAll();
      this.close();
    });
  }

  render() {
    return (
      <Modal
        full
        backdrop="static"
        className="use-max-width"
        title="Create New Gallery"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Create"
      >
        <GalleryForm />
      </Modal>
    );
  }
}

CreateGalleryModal.propTypes = {
  galleriesStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('galleriesStore', 'notificationsStore'), observer);

export default enhance(CreateGalleryModal);
