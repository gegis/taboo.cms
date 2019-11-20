import React from 'react';
import { Form, FormGroup, FormControl, Panel, IconButton, Icon, Button } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Layout from 'modules/core/client/components/admin/Layout';
import Translation from 'app/modules/core/client/components/Translation';
import UnitsHelper from 'app/modules/core/client/helpers/UnitsHelper';
import CreateUpload from './CreateUpload';
import EditUpload from './EditUpload';
import ActionButtons from 'app/modules/core/client/components/admin/ActionButtons';
import BooleanIcon from 'app/modules/core/client/components/admin/BooleanIcon';

class Uploads extends React.Component {
  constructor(props) {
    super(props);
    this.uploadsStore = props.uploadsStore;
    this.notificationsStore = props.notificationsStore;
    this.localeStore = props.localeStore;
    this.settingsStore = props.settingsStore;
    this.createModal = React.createRef();
    this.editModal = React.createRef();
    this.searchTimeout = null;
    this.openCreate = this.openCreate.bind(this);
    this.openEdit = this.openEdit.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.onLoadMore = this.onLoadMore.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  componentDidMount() {
    this.uploadsStore.loadAll();
  }

  onSearchChange(value) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.settingsStore.setLoading(true);
      this.uploadsStore.loadAll({ search: value }).then(() => {
        this.settingsStore.setLoading(false);
      });
    }, 700);
  }

  getHeaderNav() {
    return (
      <Form layout="inline">
        <FormGroup>
          <FormControl
            name="upload"
            placeholder="Search Uploads"
            style={{ width: '40vw' }}
            onChange={this.onSearchChange}
            value={this.uploadsStore.search}
          />
        </FormGroup>
      </Form>
    );
  }

  getPageActions() {
    return (
      <IconButton icon={<Icon icon="file" />} appearance="primary" onClick={this.openCreate}>
        <Translation message="Upload New" />
      </IconButton>
    );
  }

  openCreate() {
    const { wrappedInstance } = this.createModal.current;
    if (wrappedInstance) {
      wrappedInstance.open();
    }
  }

  openEdit(id) {
    const { wrappedInstance } = this.editModal.current;
    if (wrappedInstance) {
      wrappedInstance.open(id);
    }
  }

  handleDelete(id) {
    this.uploadsStore.deleteItem(id).then(data => {
      this.notificationsStore.push({
        title: this.localeStore.getTranslation('Success'),
        html: this.localeStore.getTranslation('Successfully deleted {item}', { item: data.name }),
      });
    });
  }

  handleSort(field, direction) {
    this.uploadsStore.sort(field, direction);
  }

  getUploadPreview(item, styles = {}) {
    let preview = null;
    if (item.type && item.type.indexOf('image') === 0) {
      preview = (
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          <img className="upload-preview upload-image" src={item.url} style={styles} />
        </a>
      );
    } else {
      preview = (
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          {item.name}
        </a>
      );
    }
    return preview;
  }

  handleCopy() {
    this.notificationsStore.push({
      title: this.localeStore.getTranslation('Success'),
      message: this.localeStore.getTranslation('Successfully copied'),
    });
  }

  getUploadCopyValue(item) {
    let value = item.url;
    if (item.type && item.type.indexOf('image') === 0) {
      value = `<img alt="${item.name}" src="${item.url}" />`;
    } else {
      value = `<a href="${item.url}">${item.name}</a>`;
    }
    return value;
  }

  getUploadCopyTitle(item) {
    let title = 'Copy url';
    if (item.type && item.type.indexOf('image') === 0) {
      title = 'Copy image as tag';
    }
    return title;
  }

  onLoadMore() {
    this.settingsStore.setLoading(true);
    this.uploadsStore.loadNextPage().then(() => {
      this.settingsStore.setLoading(false);
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

  getUserInfo(item) {
    let user;
    if (item && item.user && typeof item.user === 'object') {
      user = item.user;
      return (
        <div>
          <div className="">
            {user.firstName} {user.lastName}
          </div>
          <div className="">{user.email}</div>
          <div className="">{user._id}</div>
        </div>
      );
    }
    return item.user;
  }

  render() {
    return (
      <Layout
        className="uploads"
        headerNav={this.getHeaderNav()}
        pageTitle="Uploads"
        pageActions={this.getPageActions()}
      >
        <Panel className="shadow">
          {this.uploadsStore.items.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th className="rs-hidden-xs" style={{ width: '200px' }}>
                    Preview
                  </th>
                  <th>File</th>
                  <th className="rs-hidden-xs">User Doc</th>
                  <th className="rs-hidden-xs">Verified</th>
                  <th className="rs-hidden-xs">User</th>
                  <th className="action-buttons-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.uploadsStore.items.map(item => (
                  <tr key={item._id}>
                    <td className="upload-preview-wrapper rs-hidden-xs max-overflow">{this.getUploadPreview(item)}</td>
                    <td className="mobile-view-td">
                      <div className="rs-hidden-xs">
                        <div>{item.name}</div>
                        <div>{item.type}</div>
                        <div>{UnitsHelper.parseSizeAuto(item.size)}</div>
                      </div>
                      <div className="rs-visible-xs" style={{ textAlign: 'center' }}>
                        <div>{item.name}</div>
                        {this.getUploadPreview(item, { height: '100px' })}
                      </div>
                    </td>
                    <td className="rs-hidden-xs">
                      <BooleanIcon value={item.isUserDocument} />
                    </td>
                    <td className="rs-hidden-xs">
                      <BooleanIcon value={item.verified} />
                    </td>
                    <td className="rs-hidden-xs">{this.getUserInfo(item)}</td>
                    <td>
                      <ActionButtons
                        value={item._id}
                        copyValue={this.getUploadCopyValue(item)}
                        onEdit={this.openEdit}
                        onDelete={this.handleDelete}
                        onCopy={this.handleCopy}
                        copyTitle={this.getUploadCopyTitle(item)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {this.uploadsStore.items.length > 0 && this.uploadsStore.hasMoreResults && this.getLoadMoreButton()}
          {this.uploadsStore.items.length === 0 && (
            <div className="">
              <Translation message="No results found" />
            </div>
          )}
        </Panel>
        <CreateUpload ref={this.createModal} />
        <EditUpload ref={this.editModal} />
      </Layout>
    );
  }
}

Uploads.propTypes = {
  uploadsStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
  settingsStore: PropTypes.object.isRequired,
};

const enhance = compose(
  inject('uploadsStore', 'notificationsStore', 'localeStore', 'settingsStore'),
  observer
);

export default enhance(Uploads);
