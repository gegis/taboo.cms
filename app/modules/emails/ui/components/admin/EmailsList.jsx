import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ActionButtons from 'app/modules/core/ui/components/admin/ActionButtons';

class EmailsList extends React.Component {
  constructor(props) {
    super(props);
    this.emailsStore = props.emailsStore;
    this.openEditModal = props.openEditModal;
    this.handleDelete = props.handleDelete;
    this.handleCopy = props.handleCopy;
  }

  getCopyValue(item) {
    return item._id;
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>From</th>
            <th>Language</th>
            <th className="action-buttons-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {this.emailsStore.items.map(item => (
            <tr key={item._id}>
              <td>{item.subject}</td>
              <td>{item.from}</td>
              <td>{item.language}</td>
              <td>
                <ActionButtons
                  value={item._id}
                  onEdit={this.openEditModal}
                  onDelete={this.handleDelete}
                  copyValue={this.getCopyValue(item)}
                  onCopy={this.handleCopy}
                  copyTitle="Copy value"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

EmailsList.propTypes = {
  emailsStore: PropTypes.object.isRequired,
  openEditModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleCopy: PropTypes.func.isRequired,
};

const enhance = compose(inject('emailsStore'), observer);

export default enhance(EmailsList);
