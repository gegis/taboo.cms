import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ActionButtons from 'app/modules/core/client/components/admin/ActionButtons';
import Translation from 'modules/core/client/components/Translation';
import BooleanIcon from 'modules/core/client/components/admin/BooleanIcon';
import UnitsHelper from 'modules/core/client/helpers/UnitsHelper';

class UploadsList extends React.Component {
  constructor(props) {
    super(props);
    this.uploadsStore = props.uploadsStore;
    this.openEditModal = props.openEditModal;
    this.handleDelete = props.handleDelete;
    this.handleCopy = props.handleCopy;
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
      <table>
        <thead>
          <tr>
            <th className="rs-hidden-xs" style={{ width: '200px' }}>
              <Translation message="Preview" />
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
                  onEdit={this.openEditModal}
                  onDelete={this.handleDelete}
                  onCopy={this.handleCopy}
                  copyTitle={this.getUploadCopyTitle(item)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

UploadsList.propTypes = {
  uploadsStore: PropTypes.object.isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleCopy: PropTypes.func.isRequired,
};

const enhance = compose(inject('uploadsStore'), observer);

export default enhance(UploadsList);
