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
    this.uploadsAdminStore = props.uploadsAdminStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open(id) {
    this.uploadsAdminStore.resetItem();
    this.uploadsAdminStore.loadById(id).then(() => {
      this.modal.current.open();
    });
  }

  close() {
    this.uploadsAdminStore.resetItem();
    this.modal.current.close();
  }

  onSave() {
    const { item } = this.uploadsAdminStore;
    const updateItem = {
      _id: item._id,
      name: item.name,
      isUserFile: item.isUserFile,
      isPrivate: item.isPrivate,
      verified: item.verified,
      note: item.note,
    };
    this.uploadsAdminStore.update(updateItem).then(data => {
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
  uploadsAdminStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('uploadsAdminStore', 'notificationsStore'), observer);

export default enhance(EditUploadModal);
