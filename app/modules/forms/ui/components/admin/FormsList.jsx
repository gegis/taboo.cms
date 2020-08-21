import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import { IconButton, Icon } from 'rsuite';
import PropTypes from 'prop-types';

import ActionButtons from 'app/modules/core/ui/components/admin/ActionButtons';
import BooleanIcon from 'modules/core/ui/components/admin/BooleanIcon';
import FormEntriesModal from 'modules/forms/ui/components/admin/FormEntriesModal';

class FormsList extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.formsAdminStore = props.formsAdminStore;
    this.openEditModal = props.openEditModal;
    this.handleDelete = props.handleDelete;
  }

  showEntries(id) {
    this.formsAdminStore.loadEntries(id);
    this.modal.current.open();
  }

  getCustomButtons(item) {
    return [
      <IconButton
        className=""
        key="show-entries"
        appearance="default"
        onClick={this.showEntries.bind(this, item._id)}
        title="Show Entries"
        icon={<Icon icon="list-alt" />}
      />,
    ];
  }

  render() {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th className="rs-hidden-sm">ID</th>
              <th>Title</th>
              <th>Recipients</th>
              <th>Enabled</th>
              <th className="action-buttons-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.formsAdminStore.items.map(item => (
              <tr key={item._id}>
                <td className="id rs-hidden-sm">{item._id}</td>
                <td>{item.title}</td>
                <td>{item.recipients}</td>
                <td>
                  <BooleanIcon value={item.enabled} />
                </td>
                <td>
                  <ActionButtons
                    value={item._id}
                    onEdit={this.openEditModal}
                    onDelete={this.handleDelete}
                    customButtons={this.getCustomButtons(item)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <FormEntriesModal ref={this.modal} />
      </div>
    );
  }
}

FormsList.propTypes = {
  formsAdminStore: PropTypes.object.isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleCopy: PropTypes.func.isRequired,
};

const enhance = compose(inject('formsAdminStore'), observer);

export default enhance(FormsList);
