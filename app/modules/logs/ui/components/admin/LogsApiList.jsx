import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import ActionButtons from 'app/modules/core/ui/components/admin/ActionButtons';
import DateTime from 'modules/core/ui/components/DateTime';

class LogsApiList extends React.Component {
  constructor(props) {
    super(props);
    this.logsApiAdminStore = props.logsApiAdminStore;
    this.handleDelete = props.handleDelete;
  }

  getUser(item) {
    const { user = {} } = item;
    if (user) {
      return (
        <div>
          <div>{user.email}</div>
          <div className="subject sm">{user._id}</div>
        </div>
      );
    }
    return null;
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>Token</th>
            <th>User</th>
            <th>Code</th>
            <th>Message</th>
            <th>Date</th>
            <th className="action-buttons-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {this.logsApiAdminStore.items.map(item => (
            <tr key={item._id}>
              <td>{item.action}</td>
              <td className="id">{item.token}</td>
              <td>{this.getUser(item)}</td>
              <td>{item.code}</td>
              <td>{item.message}</td>
              <td>{<DateTime value={item.createdAt} />}</td>
              <td>
                <ActionButtons value={item._id} onDelete={this.handleDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

LogsApiList.propTypes = {
  logsApiAdminStore: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

const enhance = compose(inject('logsApiAdminStore'), observer);

export default enhance(LogsApiList);
