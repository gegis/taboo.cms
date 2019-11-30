import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/client/components/admin/Modal';
import BooleanIcon from 'app/modules/core/client/components/admin/BooleanIcon';
import ActionButtons from 'app/modules/core/client/components/admin/ActionButtons';
import { Form, FormControl, FormGroup } from 'rsuite';

class UserSelectDialog extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.usersStore = props.usersStore;
    this.settingsStore = props.settingsStore;
    this.searchTimeout = null;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  open() {
    this.usersStore.loadAll();
    this.modal.current.open();
  }

  close() {
    this.modal.current.close();
  }

  onSearchChange(value) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.settingsStore.setLoading(true);
      this.usersStore.loadAll({ search: value, filter: this.usersStore.filter }).then(() => {
        this.settingsStore.setLoading(false);
      });
    }, 500);
  }

  onSelect(id) {
    const { onSelect = () => {} } = this.props;
    onSelect(id);
  }

  render() {
    return (
      <Modal full backdrop="static" className="use-max-width" title="Select User" cancelName="Close" ref={this.modal}>
        <Form layout="inline">
          <FormGroup>
            <FormControl
              name="upload"
              placeholder="Search Users"
              style={{ width: '45vw' }}
              onChange={this.onSearchChange}
              value={this.usersStore.search}
            />
          </FormGroup>
        </Form>
        {this.usersStore.users.length > 0 && (
          <table>
            <thead>
              <tr>
                <th className="">User</th>
                <th className="rs-hidden-xs">Admin</th>
                <th className="rs-hidden-xs">Active</th>
                <th className="action-buttons-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.usersStore.users.map(item => (
                <tr key={item._id}>
                  <td className="">
                    <div className="subject sm">{item._id}</div>
                    <div>
                      <div>
                        {item.firstName} {item.lastName}
                      </div>
                      <div>{item.email}</div>
                    </div>
                  </td>
                  <td className="rs-hidden-xs">
                    <BooleanIcon value={item.admin} />
                  </td>
                  <td className="rs-hidden-xs">
                    <BooleanIcon value={item.active} />
                  </td>
                  <td>
                    <ActionButtons value={item._id} onSelect={this.onSelect} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Modal>
    );
  }
}

UserSelectDialog.propTypes = {
  usersStore: PropTypes.object.isRequired,
  settingsStore: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
};

const enhance = compose(inject('usersStore', 'settingsStore'), observer);

export default enhance(UserSelectDialog);
