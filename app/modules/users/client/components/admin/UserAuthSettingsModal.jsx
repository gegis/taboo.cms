import React from 'react';
import { compose } from 'recompose';
import {
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  IconButton,
  Icon,
  ButtonToolbar,
  Checkbox,
  MultiCascader,
} from 'rsuite';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import uuidv1 from 'uuid/v1';

import Modal from 'app/modules/core/client/components/admin/Modal';
import Translation from 'modules/core/client/components/Translation';

class UserAuthSettingsModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.usersStore = props.usersStore;
    this.notificationsStore = props.notificationsStore;
    this.aclStore = props.aclStore;
    this.rolesStore = props.rolesStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onSave = this.onSave.bind(this);
    this.generateApiKey = this.generateApiKey.bind(this);
    this.clearApiKey = this.clearApiKey.bind(this);
  }

  open(id) {
    this.usersStore.loadById(id).then(() => {
      if (this.aclStore.isAllowed(this.aclStore.userACL, 'admin.acl.view')) {
        this.rolesStore.loadAllRolesForSelection().then(() => {
          this.modal.current.open();
        });
      } else {
        this.modal.current.open();
      }
    });
  }

  close() {
    this.usersStore.loadAll();
    this.modal.current.close();
  }

  onSave() {
    const { item } = this.usersStore;
    this.usersStore.update(item).then(data => {
      this.notificationsStore.push({
        title: 'Success',
        html: 'Successfully updated {item}',
        translationVars: { item: data.email },
        translate: true,
      });
      this.close();
    });
  }

  generateApiKey() {
    const { setItem } = this.usersStore;
    setItem({ apiKey: uuidv1() });
  }

  clearApiKey() {
    const { setItem } = this.usersStore;
    setItem({ apiKey: '' });
  }

  render() {
    const { item, setItem, getFormData, setCheckboxItemValue } = this.usersStore;
    const { allRolesForSelection } = this.rolesStore;
    return (
      <Modal
        full
        backdrop="static"
        className="use-max-width"
        title="User Authentication Settings"
        ref={this.modal}
        onSubmit={this.onSave}
        submitName="Update"
      >
        <Form
          layout="horizontal"
          fluid
          onChange={setItem}
          formValue={getFormData('item')}
          autoComplete="off"
          className="user-auth-settings-form"
        >
          <FormGroup controlId="id" className="inline">
            <ControlLabel>
              <Translation message="ID" />
            </ControlLabel>
            <FormControl name="id" disabled />
          </FormGroup>
          <FormGroup controlId="email" className="inline">
            <ControlLabel>
              <Translation message="Email" />
            </ControlLabel>
            <FormControl name="email" disabled />
          </FormGroup>
          <FormGroup controlId="firstName" className="inline">
            <ControlLabel>
              <Translation message="First Name" />
            </ControlLabel>
            <FormControl name="firstName" disabled />
          </FormGroup>
          <FormGroup controlId="lastName" className="inline">
            <ControlLabel>
              <Translation message="Last Name" />
            </ControlLabel>
            <FormControl name="lastName" disabled />
          </FormGroup>
          <FormGroup controlId="admin" className="inline">
            <ControlLabel>
              <Translation message="Admin" />
            </ControlLabel>
            <div className="rs-form-control-wrapper">
              <Checkbox checked={item.admin} onChange={setCheckboxItemValue.bind(null, 'admin')} />
            </div>
          </FormGroup>
          <FormGroup controlId="active" className="inline">
            <ControlLabel>
              <Translation message="Active" />
            </ControlLabel>
            <div className="rs-form-control-wrapper">
              <Checkbox checked={item.active} onChange={setCheckboxItemValue.bind(null, 'active')} />
            </div>
          </FormGroup>
          <FormGroup controlId="loginAttempts" className="inline">
            <ControlLabel>
              <Translation message="Login Attempts" />
            </ControlLabel>
            <FormControl name="loginAttempts" />
          </FormGroup>
          {this.aclStore.isAllowed(this.aclStore.userACL, 'admin.acl.view') && (
            <FormGroup controlId="roles" className="inline">
              <ControlLabel>
                <Translation message="Roles" />
              </ControlLabel>
              <FormControl name="roles" accepter={MultiCascader} data={allRolesForSelection} />
            </FormGroup>
          )}
          <FormGroup controlId="apiKey" className="user-api-key-form-group">
            <ControlLabel>
              <Translation message="API Key" />
            </ControlLabel>
            <FormControl name="apiKey" />
            <ButtonToolbar className="pull-right">
              <IconButton
                className="api-key-btn"
                appearance="primary"
                onClick={this.generateApiKey}
                title="Generate API Key"
                icon={<Icon icon="refresh" />}
              />
              <IconButton
                className="api-key-btn"
                color="red"
                appearance="primary"
                onClick={this.clearApiKey}
                title="Remove API Key"
                icon={<Icon icon="close-circle" />}
              />
            </ButtonToolbar>
          </FormGroup>
        </Form>
      </Modal>
    );
  }
}

UserAuthSettingsModal.propTypes = {
  usersStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
  aclStore: PropTypes.object.isRequired,
  rolesStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('usersStore', 'notificationsStore', 'aclStore', 'rolesStore'), observer);

export default enhance(UserAuthSettingsModal);
