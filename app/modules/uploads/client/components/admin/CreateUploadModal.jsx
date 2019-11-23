import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import { Icon } from 'rsuite';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';

import Modal from 'app/modules/core/client/components/admin/Modal';
import Translation from 'app/modules/core/client/components/Translation';
import UnitsHelper from 'app/modules/core/client/helpers/UnitsHelper';

class CreateUploadModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.uploadsStore = props.uploadsStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onUpload = this.onUpload.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  open() {
    this.modal.current.open();
  }

  close() {
    this.modal.current.close();
  }

  onDrop(files = []) {
    this.uploadsStore.prependItemsToUpload(files);
  }

  onOpen() {
    this.uploadsStore.resetItemsToUpload();
  }

  onClose() {
    this.uploadsStore.resetItemsToUpload();
    this.uploadsStore.loadAll();
  }

  onUpload() {
    this.uploadsStore.uploadItems((err, data) => {
      if (!err && data) {
        this.notificationsStore.push({
          html: 'Successfully uploaded {item}',
          translationVars: { item: data.name },
          translate: true,
        });
      }
    });
  }

  getFileStatusIcon(status) {
    let icon = null;
    if (status === 'toUpload') {
      icon = <Icon icon="cloud-upload" className="light-grey" title="Waiting for upload" />;
    } else if (status === 'uploaded') {
      icon = <Icon icon="cloud-upload" className="blue" title="Uploaded" />;
    } else if (status === 'uploading') {
      icon = <Icon icon="cloud-upload" className="dark-grey" title="Uploaded" />;
    } else if (status === 'failed') {
      icon = <Icon icon="cloud-upload" className="red" title="Failed to upload" />;
    }

    return icon;
  }

  render() {
    return (
      <Modal
        full
        backdrop="static"
        keyboard={false}
        className="use-max-width"
        title="Upload new item"
        ref={this.modal}
        onSubmit={this.onUpload}
        onOpen={this.onOpen}
        onClose={this.onClose}
        submitName="Upload"
        cancelName="Close"
      >
        <Dropzone onDrop={this.onDrop.bind(this)}>
          {({ getRootProps, getInputProps, isDragActive }) => {
            return (
              <div {...getRootProps()} className={classNames('dropzone', { 'dropzone--isActive': isDragActive })}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <div>
                    <Translation message="Drop files here..." />
                  </div>
                ) : (
                  <div>
                    <Translation message="You can drag and drop files in here, or click to select files to upload." />
                  </div>
                )}
              </div>
            );
          }}
        </Dropzone>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Size</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {this.uploadsStore.itemsToUpload.map((file, i) => (
              <tr key={file.name + i}>
                <td>{file.name}</td>
                <td>{file.type}</td>
                <td>{UnitsHelper.parseSizeAuto(file.size)}</td>
                <td>{this.getFileStatusIcon(file.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>
    );
  }
}

CreateUploadModal.propTypes = {
  uploadsStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('uploadsStore', 'notificationsStore'), observer);

export default enhance(CreateUploadModal);
