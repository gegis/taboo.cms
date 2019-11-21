import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ActionButtons from 'app/modules/core/client/components/admin/ActionButtons';
import Translation from 'modules/core/client/components/Translation';
import BooleanIcon from 'modules/core/client/components/admin/BooleanIcon';

class RolesList extends React.Component {
  constructor(props) {
    super(props);
    this.galleriesStore = props.galleriesStore;
    this.openEditModal = props.openEditModal;
    this.handleDelete = props.handleDelete;
    this.handleCopy = props.handleCopy;
  }

  getCopyValue(item) {
    const innerHtml = `<h1 class="text-center mb-5 first">${item.title}</h1>\n{{Gallery:${item._id}}}\n`;
    return `<section class="gallery inverted">\n${innerHtml}</section>`;
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th className="rs-hidden-xs">ID</th>
            <th>Title</th>
            <th className="rs-hidden-xs">Images</th>
            <th className="rs-hidden-xs">Published</th>
            <th className="action-buttons-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {this.galleriesStore.items.map(item => (
            <tr key={item._id}>
              <td className="id rs-hidden-xs">{item._id}</td>
              <td className="mobile-view-td">
                <div>{item.title}</div>
                <div className="rs-visible-xs">
                  <span className="subject sm">
                    <Translation message="Images" />:
                  </span>{' '}
                  {item.images.length}
                </div>
                <div className="rs-visible-xs subject sm">{item._id}</div>
              </td>
              <td className="rs-hidden-xs">{item.images.length}</td>
              <td className="rs-hidden-xs">
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
  galleriesStore: PropTypes.object.isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleCopy: PropTypes.func.isRequired,
};

const enhance = compose(inject('galleriesStore'), observer);

export default enhance(RolesList);
