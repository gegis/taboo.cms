import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/ui/components/admin/Modal';
import UploadForm from './UploadForm';

class EditUploadModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.uploadsStore = props.uploadsStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open(id) {
    this.uploadsStore.resetItem();
    this.uploadsStore.loadById(id).then(() => {
      this.modal.current.open();
    });
  }

  close() {
    this.uploadsStore.resetItem();
    this.modal.current.close();
  }

  onSave() {
    const { item } = this.uploadsStore;
    const updateItem = {
      _id: item._id,
      name: item.name,
      isUserFile: item.isUserFile,
      isPrivate: item.isPrivate,
      verified: item.verified,
      note: item.note,
    };
    this.uploadsStore.update(updateItem).then(data => {
      this.notificationsStore.push({
        html: 'Successfully updated {item}',
        translationVars: { item: data.name },
        translate: true,
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

EditUploadModal.propTypes = {
  uploadsStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('uploadsStore', 'notificationsStore'), observer);

export default enhance(EditUploadModal);
