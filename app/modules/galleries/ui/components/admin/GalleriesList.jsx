import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ActionButtons from 'app/modules/core/ui/components/admin/ActionButtons';
import Translation from 'modules/core/ui/components/Translation';
import BooleanIcon from 'modules/core/ui/components/admin/BooleanIcon';

class RolesList extends React.Component {
  constructor(props) {
    super(props);
    this.galleriesAdminStore = props.galleriesAdminStore;
    this.openEditModal = props.openEditModal;
    this.handleDelete = props.handleDelete;
    this.handleCopy = props.handleCopy;
  }

  getCopyValue(item) {
    return `{{Gallery:${item._id}}}`;
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th className="rs-hidden-sm">ID</th>
            <th>Title</th>
            <th className="rs-hidden-sm">Images</th>
            <th className="rs-hidden-sm">Published</th>
            <th className="action-buttons-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {this.galleriesAdminStore.items.map(item => (
            <tr key={item._id}>
              <td className="id rs-hidden-sm">{item._id}</td>
              <td className="mobile-view-td">
                <div>{item.title}</div>
                <div className="rs-visible-sm">
                  <span className="subject sm">
                    <Translation message="Images" />:
                  </span>{' '}
                  {item.images.length}
                </div>
                <div className="rs-visible-sm subject sm">{item._id}</div>
              </td>
              <td className="rs-hidden-sm">{item.images.length}</td>
              <td className="rs-hidden-sm">
                <BooleanIcon value={item.published} />
              </td>
              <td>
                <ActionButtons
                  value={item._id}
                  copyValue={this.getCopyValue(item)}
                  onEdit={this.openEditModal}
                  onDelete={this.handleDelete}
                  onCopy={this.handleCopy}
                  copyTitle="Copy gallery value as snippet"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

RolesList.propTypes = {
  galleriesAdminStore: PropTypes.object.isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleCopy: PropTypes.func.isRequired,
};

const enhance = compose(inject('galleriesAdminStore'), observer);

export default enhance(RolesList);
