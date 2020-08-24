import React from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ActionButtons from 'app/modules/core/ui/components/admin/ActionButtons';
import Translation from 'modules/core/ui/components/Translation';
import BooleanIcon from 'modules/core/ui/components/admin/BooleanIcon';
import UnitsHelper from 'modules/core/ui/helpers/UnitsHelper';

class UploadsList extends React.Component {
  constructor(props) {
    super(props);
    this.uploadsAdminStore = props.uploadsAdminStore;
    this.openEditModal = props.openEditModal;
    this.handleDelete = props.handleDelete;
    this.handleCopy = props.handleCopy;
  }

  getUploadCopyValue(item) {
    return item.url;
  }

  getUploadCopyTitle() {
    return 'Copy path';
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
    if (item && item.user && typeof item.user === 'object') {
      return (
        <Link to={`/admin/users?search=username %3D ${item.user.username}`} title="View User">
          {item.user.username}
        </Link>
      );
    }
    return item.user;
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th className="rs-hidden-sm" style={{ width: '200px' }}>
              <Translation message="Preview" />
            </th>
            <th>File</th>
            <th className="rs-hidden-sm">User File</th>
            <th className="rs-hidden-sm">User</th>
            <th className="action-buttons-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {this.uploadsAdminStore.items.map(item => (
            <tr key={item._id}>
              <td className="upload-preview-wrapper rs-hidden-sm max-overflow">{this.getUploadPreview(item)}</td>
              <td className="mobile-view-td">
                <div className="rs-hidden-sm">
                  <div>{item.name}</div>
                  <div>{item.type}</div>
                  <div>{UnitsHelper.parseSizeAuto(item.size)}</div>
                </div>
                <div className="rs-visible-sm" style={{ textAlign: 'center' }}>
                  <div>{item.name}</div>
                  {this.getUploadPreview(item, { height: '100px' })}
                </div>
              </td>
              <td className="rs-hidden-sm">
                <BooleanIcon value={item.isUserFile} />
              </td>
              <td className="rs-hidden-sm">{this.getUserInfo(item)}</td>
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
  uploadsAdminStore: PropTypes.object.isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleCopy: PropTypes.func.isRequired,
};

const enhance = compose(inject('uploadsAdminStore'), observer);

export default enhance(UploadsList);
