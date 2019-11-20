import React from 'react';
import { Notification } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/client/components/admin/Modal';
import UserForm from './UserForm';

class EditUser extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.usersStore = props.usersStore;
    this.localeStore = props.localeStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open(id) {
    this.usersStore.loadOne(id).then(() => {
      this.modal.current.open();
    });
  }

  close() {
    this.usersStore.resetUser();
    this.modal.current.close();
  }

  getSuccessMessage(data) {
    return {
      __html: this.localeStore.getTranslation('Successfully updated {item}', { item: data.email }),
    };
  }

  onSave() {
    const { user } = this.usersStore;
    this.usersStore.updateUser(user).then(data => {
      Notification.open({
        title: 'Message',
        description: <span dangerouslySetInnerHTML={this.getSuccessMessage(data)} />,
        duration: 5000,
      });
      this.close();
    });
  }

  render() {
    return (
      <Modal
        full
        backdrop="static"
        className="use-max-width"
        title="Edit User"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Update"
      >
        <UserForm />
      </Modal>
    );
  }
}

EditUser.propTypes = {
  usersStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
};

const enhance = compose(
  inject('usersStore', 'localeStore'),
  observer
);

export default enhance(EditUser);
