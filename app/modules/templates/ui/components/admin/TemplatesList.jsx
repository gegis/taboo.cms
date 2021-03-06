import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ActionButtons from 'app/modules/core/ui/components/admin/ActionButtons';
import BooleanIcon from 'modules/core/ui/components/admin/BooleanIcon';

class TemplatesList extends React.Component {
  constructor(props) {
    super(props);
    this.templatesAdminStore = props.templatesAdminStore;
    this.openEditModal = props.openEditModal;
    this.handleDelete = props.handleDelete;
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>Preview</th>
            <th>Title</th>
            <th>Name</th>
            <th>Description</th>
            <th>Default</th>
            <th className="action-buttons-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {this.templatesAdminStore.items.map(item => (
            <tr key={item.name}>
              <td>
                <a href={item.preview} target="_blank" rel="noopener noreferrer">
                  <img src={item.preview} style={{ height: '100px' }} alt="preview" />
                </a>
              </td>
              <td>{item.title}</td>
              <td>{item.name}</td>
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
  templatesAdminStore: PropTypes.object.isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleCopy: PropTypes.func.isRequired,
};

const enhance = compose(inject('templatesAdminStore'), observer);

export default enhance(TemplatesList);
