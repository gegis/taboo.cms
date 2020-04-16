import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ActionButtons from 'app/modules/core/client/components/admin/ActionButtons';
import BooleanIcon from 'modules/core/client/components/admin/BooleanIcon';

class TemplatesList extends React.Component {
  constructor(props) {
    super(props);
    this.templatesStore = props.templatesStore;
    this.openEditModal = props.openEditModal;
    this.handleDelete = props.handleDelete;
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th className="rs-hidden-xs">ID</th>
            <th>Preview</th>
            <th>Title</th>
            <th>Description</th>
            <th>Default</th>
            <th className="action-buttons-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {this.templatesStore.items.map(item => (
            <tr key={item._id}>
              <td className="id rs-hidden-xs">{item._id}</td>
              <td>{item.preview}</td>
              <td>{item.title}</td>
              <td>{item.description}</td>
              <td>
                <BooleanIcon value={item.default} />
              </td>
              <td>
                <ActionButtons value={item._id} onEdit={this.openEditModal} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

TemplatesList.propTypes = {
  templatesStore: PropTypes.object.isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleCopy: PropTypes.func.isRequired,
};

const enhance = compose(inject('templatesStore'), observer);

export default enhance(TemplatesList);
