import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/ui/components/admin/Modal';
import BooleanIcon from 'app/modules/core/ui/components/admin/BooleanIcon';
import ActionButtons from 'app/modules/core/ui/components/admin/ActionButtons';
import { Form, FormControl, FormGroup } from 'rsuite';

class UserSelectDialog extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.usersAdminStore = props.usersAdminStore;
    this.uiAdminStore = props.uiAdminStore;
    this.searchTimeout = null;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  open() {
    this.usersAdminStore.loadAll();
    this.modal.current.open();
  }

  close() {
    this.modal.current.close();
  }

  onSearchChange(value) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.uiAdminStore.setLoading(true);
      this.usersAdminStore.loadAll({ search: value, filter: this.usersAdminStore.filter }).then(() => {
        this.uiAdminStore.setLoading(false);
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
              value={this.usersAdminStore.search}
            />
          </FormGroup>
        </Form>
        {this.usersAdminStore.users.length > 0 && (
          <table>
            <thead>
              <tr>
                <th className="">User</th>
                <th className="rs-hidden-sm">Admin</th>
                <th className="rs-hidden-sm">Active</th>
                <th className="action-buttons-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.usersAdminStore.users.map(item => (
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
                  <td className="rs-hidden-sm">
                    <BooleanIcon value={item.admin} />
                  </td>
                  <td className="rs-hidden-sm">
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
  usersAdminStore: PropTypes.object.isRequired,
  uiAdminStore: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
};

const enhance = compose(inject('usersAdminStore', 'uiAdminStore'), observer);

export default enhance(UserSelectDialog);
