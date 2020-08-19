import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { Button, Input } from 'rsuite';

import Modal from 'app/modules/core/ui/components/Modal';
import UploadsHelper from 'app/modules/uploads/ui/helpers/UploadsHelper';

class UploadSelect extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.uploadInput = React.createRef();
    this.uploadsStore = props.uploadsStore;
    this.notificationsStore = props.notificationsStore;
    this.uiStore = props.uiStore;
    this.searchTimeout = null;
    this.onOpenSelectCB = null;
    this.state = {
      search: '',
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onLoadMore = this.onLoadMore.bind(this);
    this.openNewUpload = this.openNewUpload.bind(this);
  }

  open(onSelect = null) {
    const opts = {};
    const { filter = null } = this.props;
    if (filter) {
      opts.filter = filter;
    }
    if (onSelect) {
      this.onOpenSelectCB = onSelect;
    }
    this.uploadsStore.loadAll(opts);
    this.modal.current.open();
  }

  close() {
    this.modal.current.close();
  }

  onSearchChange(search) {
    clearTimeout(this.searchTimeout);
    this.setState({ search });
    this.searchTimeout = setTimeout(() => {
      this.uiStore.setLoading(true);
      this.uploadsStore.loadAll({ search: search, filter: this.uploadsStore.filter }).then(() => {
        this.uiStore.setLoading(false);
      });
    }, 500);
  }

  getUploadPreview(item, styles = {}) {
    let preview = null;
    if (item.type && item.type.indexOf('image') === 0) {
      preview = <img className="upload-preview upload-image" src={item.url} style={styles} />;
    }
    return preview;
  }

  onLoadMore() {
    this.uiStore.setLoading(true);
    this.uploadsStore.loadNextPage().then(() => {
      this.uiStore.setLoading(false);
    });
  }

  getLoadMoreButton() {
    return (
      <div className="load-more-wrapper">
        <Button appearance="primary" onClick={this.onLoadMore}>
          Load More...
        </Button>
      </div>
    );
  }

  onItemSelect(item) {
    const { onFileSelect, closeOnSelect = false } = this.props;
    if (this.onOpenSelectCB) {
      this.onOpenSelectCB(item);
    } else if (onFileSelect) {
      onFileSelect(item);
    }
    if (closeOnSelect) {
      this.close();
    }
  }

  getModalTitle() {
    const { search } = this.state;
    return (
      <div>
        <h5>Upload or Select an Image</h5>
        <Input
          className="pull-left"
          name="upload-search"
          placeholder="Search for Images"
          style={{ width: '50%', maxWidth: '500px' }}
          onChange={this.onSearchChange}
          value={search}
        />
        <Button appearance="primary" onClick={this.openNewUpload} className="pull-right">
          Upload
        </Button>
        <input
          id="upload-file-input"
          type="file"
          ref={this.uploadInput}
          onChange={this.onFileUploadSelect.bind(this)}
        />
        <div className="clearfix" />
      </div>
    );
  }

  openNewUpload() {
    const { current } = this.uploadInput;
    if (current) {
      current.click();
    }
  }

  onFileUploadSelect(event) {
    const { target: { files = [] } = {} } = event;
    event.stopPropagation();
    event.preventDefault();
    if (files.length > 0) {
      try {
        UploadsHelper.validateFileSize(files[0]);
        this.uploadsStore.uploadUserDocument(files[0], 'image').then(data => {
          if (data) {
            this.notificationsStore.push({
              title: 'Success',
              html: 'Successfully uploaded',
            });
            this.uploadsStore.loadAll();
          }
        });
      } catch (e) {
        this.notificationsStore.push({
          title: 'Error',
          html: e.message,
        });
      }
    }
  }

  getItems() {
    const items = [];
    this.uploadsStore.items.map(item => {
      items.push(
        <div
          key={item._id}
          title="Click to inset this image"
          className="upload-select-image-wrapper"
          onClick={this.onItemSelect.bind(this, item)}
        >
          {this.getUploadPreview(item)}
        </div>
      );
    });
    return items;
  }

  render() {
    return (
      <div className="upload-select-modal-wrapper">
        <Modal
          full
          backdrop="static"
          className="use-max-width upload-select-modal"
          title={this.getModalTitle()}
          ref={this.modal}
          cancelName="Close"
        >
          {this.uploadsStore.items.length > 0 && <div className="upload-select-images">{this.getItems()}</div>}
          {this.uploadsStore.items.length > 0 && this.uploadsStore.hasMoreResults && this.getLoadMoreButton()}
          {this.uploadsStore.items.length === 0 && <div className="no-results">No results found</div>}
          {this.uploadsStore.uploading && (
            <div className="upload-select-uploading">
              <div className="loader" />
            </div>
          )}
        </Modal>
      </div>
    );
  }
}

UploadSelect.propTypes = {
  uploadsStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
  uiStore: PropTypes.object.isRequired,
  filter: PropTypes.object,
  onFileSelect: PropTypes.func,
  closeOnSelect: PropTypes.bool,
};

const enhance = compose(inject('uploadsStore', 'notificationsStore', 'uiStore'), observer);

export default enhance(UploadSelect);
