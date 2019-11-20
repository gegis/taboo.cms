import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/client/components/admin/Modal';

import UploadForm from './UploadForm';

class EditUpload extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.uploadsStore = props.uploadsStore;
    this.localeStore = props.localeStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open(id) {
    this.uploadsStore.loadItem(id).then(this.modal.current.open());
  }

  close() {
    this.uploadsStore.resetItemData();
    this.modal.current.close();
  }

  onSave() {
    this.uploadsStore.saveItem().then(data => {
      this.notificationsStore.push({
        title: this.localeStore.getTranslation('Success'),
        html: this.localeStore.getTranslation('Successfully updated {item}', { item: data.name }),
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
        title="Edit Upload"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Update"
      >
        <UploadForm />
      </Modal>
    );
  }
}

EditUpload.propTypes = {
  uploadsStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(
  inject('uploadsStore', 'localeStore', 'notificationsStore'),
  observer
);

export default enhance(EditUpload);
