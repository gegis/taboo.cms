import React from 'react';
import { Notification } from 'rsuite';
import axios from 'axios';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/client/components/admin/Modal';
import ResponseHelper from 'app/modules/core/client/helpers/ResponseHelper';

import UserForm from './UserForm';

class CreateUser extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.usersStore = props.usersStore;
    this.localeStore = props.localeStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  open() {
    this.usersStore.resetUser();
    this.modal.current.open();
  }

  close() {
    this.usersStore.resetUser();
    this.modal.current.close();
  }

  getSuccessMessage(data) {
    return {
      __html: this.localeStore.getTranslation('Successfully created {item}', { item: data.email }),
    };
  }

  onSave() {
    axios
      .post('/api/admin/users', this.usersStore.user)
      .then(response => {
        if (response && response.data) {
          Notification.open({
            title: 'Message',
            description: <span dangerouslySetInnerHTML={this.getSuccessMessage(this.usersStore.user)} />,
            duration: 5000,
          });
          this.usersStore.resetUser();
          this.usersStore.loadAll();
          this.close();
        }
      })
      .catch(ResponseHelper.handleError);
  }

  render() {
    return (
      <Modal
        full
        backdrop="static"
        className="use-max-width"
        title="Create User"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Create"
      >
        <UserForm />
      </Modal>
    );
  }
}

CreateUser.propTypes = {
  usersStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
};

const enhance = compose(
  inject('usersStore', 'localeStore'),
  observer
);

export default enhance(CreateUser);
