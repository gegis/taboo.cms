import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import { Icon } from 'rsuite';
import Dropzone from 'react-dropzone';

class DocumentUpload extends React.Component {
  getDocumentPreview(document = {}) {
    const { imageSize = '' } = this.props;
    let preview = null;
    let url;
    if (document && document._id) {
      if (document.type && document.type.indexOf('image') === 0) {
        url = document.url;
        if (imageSize) {
          url += `?size=${imageSize}`;
        }
        preview = (
          <div className="current-document current-document-image">
            <img className="current-document-image-preview" src={url} />
          </div>
        );
      } else {
        preview = (
          <div className="current-document current-document-file">
            <div>
              <Icon icon="file-text" />
            </div>
            <div>{document.name}</div>
          </div>
        );
      }
    }
    return preview;
  }

  getUploadElement({ getRootProps, getInputProps, isDragActive }) {
    const { uploadsStore, documentName, currentDocument = {}, title, className = '' } = this.props;
    const uploadDocument = uploadsStore.documentsToUpload[documentName];
    let wrapperClassName = 'document-upload-wrapper';
    if (isDragActive) {
      wrapperClassName = `${wrapperClassName} drag-is-active`;
    }
    if (uploadDocument && uploadDocument.status === 'uploading') {
      wrapperClassName = `${wrapperClassName} uploading`;
    }
    if (uploadDocument && uploadDocument.status === 'uploaded') {
      wrapperClassName = `${wrapperClassName} uploaded`;
    }
    if (className) {
      wrapperClassName = `${wrapperClassName} ${className}`;
    }
    return (
      <section className={wrapperClassName}>
        <div {...getRootProps()} className="document-wrapper">
          <input {...getInputProps()} />
          <div className="drag-file-here">
            <div className="upload-instructions">
              <div className="active">Choose a file</div>
              <div>or drag it here</div>
              <div>
                <Icon icon="cloud-upload" />
              </div>
            </div>
            {this.getDocumentPreview(currentDocument)}
            <div className="loader" />
          </div>
        </div>
        {title && <div className="document-upload-footer">{title}</div>}
      </section>
    );
  }

  render() {
    const { onFileDrop } = this.props;
    return <Dropzone onDrop={onFileDrop}>{this.getUploadElement.bind(this)}</Dropzone>;
  }
}

DocumentUpload.propTypes = {
  uploadsStore: PropTypes.object.isRequired,
  onFileDrop: PropTypes.func,
  documentName: PropTypes.string,
  currentDocument: PropTypes.object,
  imageSize: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string,
};

const enhance = compose(withRouter, inject('uploadsStore'), observer);

export default enhance(DocumentUpload);
