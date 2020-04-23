import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { Button, IconButton, Icon, Input } from 'rsuite';

import Modal from 'app/modules/core/ui/components/admin/Modal';
import UnitsHelper from 'app/modules/core/ui/helpers/UnitsHelper';
import ActionButtons from 'app/modules/core/ui/components/admin/ActionButtons';
import Translation from 'app/modules/core/ui/components/Translation';
import CreateUploadModal from './CreateUploadModal';

class UploadSelect extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.createModal = React.createRef();
    this.uploadsStore = props.uploadsStore;
    this.localeStore = props.localeStore;
    this.notificationsStore = props.notificationsStore;
    this.uiAdminStore = props.uiAdminStore;
    this.searchTimeout = null;
    this.state = {
      search: '',
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onLoadMore = this.onLoadMore.bind(this);
    this.onItemSelect = this.onItemSelect.bind(this);
    this.openNewUpload = this.openNewUpload.bind(this);
  }

  open() {
    const opts = {};
    const { filter = null } = this.props;
    if (filter) {
      opts.filter = filter;
    }
    this.uploadsStore.loadAll(opts);
    this.modal.current.open();
  }

  close() {
    this.modal.current.close();
  }

  openNewUpload() {
    const { current } = this.createModal;
    if (current) {
      current.open();
    }
  }

  onSearchChange(search) {
    clearTimeout(this.searchTimeout);
    this.setState({ search });
    this.searchTimeout = setTimeout(() => {
      this.uiAdminStore.setLoading(true);
      this.uploadsStore.loadAll({ search: search, filter: this.uploadsStore.filter }).then(() => {
        this.uiAdminStore.setLoading(false);
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
    this.uiAdminStore.setLoading(true);
    this.uploadsStore.loadNextPage().then(() => {
      this.uiAdminStore.setLoading(false);
    });
  }

  getLoadMoreButton() {
    return (
      <div className="load-more-wrapper">
        <Button appearance="primary" onClick={this.onLoadMore}>
          <Translation message="Load More" />
          ...
        </Button>
      </div>
    );
  }

  onItemSelect(item) {
    const { onFileSelect, closeOnSelect = false } = this.props;
    onFileSelect(item);
    if (closeOnSelect) {
      this.close();
    }
  }

  getItems() {
    const items = [];
    const { closeOnSelect = false } = this.props;
    this.uploadsStore.items.map(item => {
      items.push(
        <tr key={item._id}>
          <td className="rs-hidden-sm upload-preview-wrapper">{this.getUploadPreview(item)}</td>
          <td className="mobile-view-td">
            <div className="rs-hidden-sm">{item.name}</div>
            <div className="rs-visible-sm" style={{ textAlign: 'center' }}>
              <div>{item.name}</div>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {this.getUploadPreview(item, { height: '100px' })}
              </a>
            </div>
          </td>
          <td className="rs-hidden-sm">{item.type}</td>
          <td className="rs-hidden-sm">{UnitsHelper.parseSizeAuto(item.size)}</td>
          <td>
            {!closeOnSelect && <ActionButtons value={item} onAdd={this.onItemSelect} />}
            {closeOnSelect && <ActionButtons value={item} onSelect={this.onItemSelect} />}
          </td>
        </tr>
      );
    });
    return items;
  }

  getModalTitle() {
    const { search } = this.state;
    return (
      <div>
        <h4>
          <Translation message="Uploads Select" />
        </h4>
        <Input
          className="pull-left"
          name="upload"
          placeholder="Search Uploads"
          style={{ width: '45vw' }}
          onChange={this.onSearchChange}
          value={search}
        />
        <IconButton
          appearance="primary"
          icon={<Icon icon="file-upload" />}
          onClick={this.openNewUpload}
          className="pull-right"
        >
          <Translation message="Upload" />
        </IconButton>
      </div>
    );
  }

  render() {
    return (
      <div className="upload-select-wrapper">
        <Modal
          full
          backdrop="static"
          className="use-max-width"
          title={this.getModalTitle()}
          ref={this.modal}
          cancelName="Close"
        >
          {this.uploadsStore.items.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th className="rs-hidden-sm" style={{ width: '150px' }}>
                    Preview
                  </th>
                  <th>File</th>
                  <th className="rs-hidden-sm">Type</th>
                  <th className="rs-hidden-sm">Size</th>
                  <th className="action-buttons-2">Actions</th>
                </tr>
              </thead>
              <tbody>{this.getItems()}</tbody>
            </table>
          )}
          {this.uploadsStore.items.length > 0 && this.uploadsStore.hasMoreResults && this.getLoadMoreButton()}
          {this.uploadsStore.items.length === 0 && (
            <div className="">
              <Translation message="No results found" />
            </div>
          )}
        </Modal>
        <CreateUploadModal ref={this.createModal} />
      </div>
    );
  }
}

UploadSelect.propTypes = {
  uploadsStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
  uiAdminStore: PropTypes.object.isRequired,
  filter: PropTypes.object,
  onFileSelect: PropTypes.func,
  closeOnSelect: PropTypes.bool,
};

const enhance = compose(inject('uploadsStore', 'localeStore', 'notificationsStore', 'uiAdminStore'), observer);

export default enhance(UploadSelect);
