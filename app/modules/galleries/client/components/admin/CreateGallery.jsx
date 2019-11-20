import React from 'react';
import { Notification } from 'rsuite';
import axios from 'axios';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/client/components/admin/Modal';
import ResponseHelper from 'app/modules/core/client/helpers/ResponseHelper';

import GalleryForm from './GalleryForm';

class CreateGallery extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.galleriesStore = props.galleriesStore;
    this.localeStore = props.localeStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open() {
    this.galleriesStore.resetGallery();
    this.modal.current.open();
  }

  close() {
    this.galleriesStore.resetGallery();
    this.modal.current.close();
  }

  getSuccessMessage(data) {
    return {
      __html: this.localeStore.getTranslation('Successfully created {item}', { item: data.title }),
    };
  }

  onSave() {
    axios
      .post('/api/admin/galleries', this.galleriesStore.gallery)
      .then(response => {
        if (response && response.data) {
          Notification.open({
            title: 'Message',
            description: <span dangerouslySetInnerHTML={this.getSuccessMessage(this.galleriesStore.gallery)} />,
            duration: 5000,
          });
          this.galleriesStore.resetGallery();
          this.galleriesStore.loadAll();
          this.close();
        }
      })
      .catch(ResponseHelper.handleError);
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

CreateGallery.propTypes = {
  galleriesStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
};

const enhance = compose(
  inject('galleriesStore', 'localeStore'),
  observer
);

export default enhance(CreateGallery);
