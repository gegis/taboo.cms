import React from 'react';
import { Notification } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/client/components/admin/Modal';
import GalleryForm from './GalleryForm';

class EditGallery extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.galleriesStore = props.galleriesStore;
    this.localeStore = props.localeStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open(id) {
    this.galleriesStore.loadOne(id);
    this.modal.current.open();
  }

  close() {
    this.galleriesStore.resetGallery();
    this.modal.current.close();
  }

  getSuccessMessage(data) {
    return {
      __html: this.localeStore.getTranslation('Successfully updated {item}', { item: data.title }),
    };
  }

  onSave() {
    const { gallery } = this.galleriesStore;
    this.galleriesStore.updateGallery(gallery).then(() => {
      Notification.open({
        title: 'Message',
        description: <span dangerouslySetInnerHTML={this.getSuccessMessage(gallery)} />,
        duration: 5000,
      });
      this.close();
    });
  }

  render() {
    return (
      <Modal
        full
        backdrop="static"
        className="use-max-width"
        title="Edit Gallery"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Update"
      >
        <GalleryForm />
      </Modal>
    );
  }
}

EditGallery.propTypes = {
  galleriesStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
};

const enhance = compose(
  inject('galleriesStore', 'localeStore'),
  observer
);

export default enhance(EditGallery);
