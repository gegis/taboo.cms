import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/client/components/admin/Modal';

import UnitsHelper from 'app/modules/core/client/helpers/UnitsHelper';
import ActionButtons from 'app/modules/core/client/components/admin/ActionButtons';
import Translation from 'app/modules/core/client/components/Translation';
import { Button, Form, FormControl, FormGroup } from 'rsuite';

class UploadSelect extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
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
    this.uploadsStore.resetItemData();
    this.modal.current.close();
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

  getItems() {
    const items = [];
    const { onAdd } = this.props;
    this.uploadsStore.items.map(item => {
      items.push(
        <tr key={item._id}>
          <td className="rs-hidden-xs upload-preview-wrapper">{this.getUploadPreview(item)}</td>
          <td className="mobile-view-td">
            <div className="rs-hidden-xs">{item.name}</div>
            <div className="rs-visible-xs" style={{ textAlign: 'center' }}>
              <div>{item.name}</div>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {this.getUploadPreview(item, { height: '100px' })}
              </a>
            </div>
          </td>
          <td className="rs-hidden-xs">{item.type}</td>
          <td className="rs-hidden-xs">{UnitsHelper.parseSizeAuto(item.size)}</td>
          <td>
            <ActionButtons value={item} onAdd={onAdd} />
          </td>
        </tr>
      );
    });
    return items;
  }

  render() {
    const { search } = this.state;
    return (
      <Modal
        full
        backdrop="static"
        className="use-max-width"
        title="Uploads Select"
        ref={this.modal}
        cancelName="Close"
      >
        <Form layout="inline">
          <FormGroup>
            <FormControl
              name="upload"
              placeholder="Search Uploads"
              style={{ width: '45vw' }}
              onChange={this.onSearchChange}
              value={search}
            />
          </FormGroup>
        </Form>
        {this.uploadsStore.items.length > 0 && (
          <table>
            <thead>
              <tr>
                <th className="rs-hidden-xs" style={{ width: '150px' }}>
                  Preview
                </th>
                <th>File</th>
                <th className="rs-hidden-xs">Type</th>
                <th className="rs-hidden-xs">Size</th>
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
    );
  }
}

UploadSelect.propTypes = {
  uploadsStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
  uiAdminStore: PropTypes.object.isRequired,
  filter: PropTypes.object,
  onAdd: PropTypes.func,
};

const enhance = compose(inject('uploadsStore', 'localeStore', 'notificationsStore', 'uiAdminStore'), observer);

export default enhance(UploadSelect);
