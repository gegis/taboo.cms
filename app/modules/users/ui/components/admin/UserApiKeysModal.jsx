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
  Panel,
  Whisper,
  Popover,
} from 'rsuite';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Modal from 'app/modules/core/ui/components/admin/Modal';
import Translation from 'modules/core/ui/components/Translation';
import DateTime from 'modules/core/ui/components/DateTime';

class UserApiKeysModal extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.userId = null;
    this.deleteConfirmRefs = {};
    this.usersAdminStore = props.usersAdminStore;
    this.notificationsStore = props.notificationsStore;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.renewApiKey = this.renewApiKey.bind(this);
    this.deleteApiKey = this.deleteApiKey.bind(this);
  }

  open(userId) {
    this.userId = userId;
    this.usersAdminStore.resetUserApiKeys();
    this.usersAdminStore.loadApiKeysByUserId(userId);
    this.usersAdminStore.loadById(userId).then(() => {
      this.modal.current.open();
    });
  }

  close() {
    this.usersAdminStore.resetUserApiKeys();
    this.userId = null;
    this.modal.current.close();
  }

  onCreate() {
    this.usersAdminStore.createApiKey(this.userId).then(data => {
      if (data) {
        this.notificationsStore.push({
          title: 'Success',
          html: 'Generated new API Key',
          translate: true,
        });
        this.usersAdminStore.loadApiKeysByUserId(this.userId);
      }
    });
  }

  renewApiKey(apiKeyId) {
    this.usersAdminStore.renewUserApiKey(this.userId, apiKeyId).then(data => {
      if (data) {
        this.notificationsStore.push({
          title: 'Success',
          html: 'API Key was successfully renewed',
          translate: true,
        });
        this.usersAdminStore.loadApiKeysByUserId(this.userId);
      }
    });
  }

  deleteApiKey(apiKeyId) {
    this.usersAdminStore.deleteUserApiKey(this.userId, apiKeyId).then(data => {
      if (data) {
        this.notificationsStore.push({
          title: 'Success',
          html: 'API Key was successfully deleted',
          translate: true,
        });
        this.usersAdminStore.loadApiKeysByUserId(this.userId);
      }
    });
  }

  deleteConfirm(title, handler, refId) {
    return (
      <Popover title={<Translation message={title} />}>
        <ButtonToolbar style={{ textAlign: 'center' }}>
          <IconButton
            icon={<Icon icon="close" />}
            appearance="ghost"
            size="sm"
            style={{ paddingRight: 10 }}
            onClick={() => {
              if (this.deleteConfirmRefs && this.deleteConfirmRefs[refId]) {
                this.deleteConfirmRefs[refId].hide();
              }
            }}
          />
          <IconButton appearance="primary" icon={<Icon icon="check" />} size="sm" onClick={handler} />
        </ButtonToolbar>
      </Popover>
    );
  }

  render() {
    const { item, setItem, getFormData, userApiKeys } = this.usersAdminStore;
    return (
      <Modal
        full
        backdrop="static"
        className="use-max-width"
        title="User Authentication Settings"
        ref={this.modal}
        cancelName="Close"
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
              <Checkbox checked={item.admin} disabled={true} />
            </div>
          </FormGroup>
          <FormGroup controlId="active" className="inline">
            <ControlLabel>
              <Translation message="Active" />
            </ControlLabel>
            <div className="rs-form-control-wrapper">
              <Checkbox checked={item.active} disabled={true} />
            </div>
          </FormGroup>
          <div className="panel-wrapper">
            <div className="header">
              <div className="pull-left">
                <h5>
                  <Translation message="API Keys" />
                </h5>
              </div>
              <div className="pull-right">
                <IconButton icon={<Icon icon="plus-square" />} appearance="primary" onClick={this.onCreate}>
                  <Translation message="Generate API Key" />
                </IconButton>
              </div>
              <div className="clearfix" />
            </div>
            <Panel bordered={true}>
              <table>
                <thead>
                  <tr>
                    <th>
                      <Translation message="API Key" />
                    </th>
                    <th>
                      <Translation message="Expires At" />
                    </th>
                    <th className="action-buttons-2">
                      <Translation message="Actions" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userApiKeys.map(item => (
                    <tr key={item._id}>
                      <td>{item.token}</td>
                      <td>
                        <DateTime value={item.expiresAt} />
                      </td>
                      <td>
                        <ButtonToolbar className="pull-right">
                          <IconButton
                            appearance="primary"
                            onClick={this.renewApiKey.bind(this, item._id)}
                            title="Renew API Key"
                            icon={<Icon icon="refresh" />}
                          />
                          <Whisper
                            placement="left"
                            trigger="click"
                            triggerRef={ref => (this.deleteConfirmRefs[item._id] = ref)}
                            speaker={this.deleteConfirm(
                              'Do you want to delete?',
                              this.deleteApiKey.bind(this, item._id),
                              item._id
                            )}
                          >
                            <IconButton
                              color="red"
                              appearance="primary"
                              title="Delete API Key"
                              icon={<Icon icon="trash-o" />}
                            />
                          </Whisper>
                        </ButtonToolbar>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          </div>
        </Form>
      </Modal>
    );
  }
}

UserApiKeysModal.propTypes = {
  usersAdminStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('usersAdminStore', 'notificationsStore'), observer);

export default enhance(UserApiKeysModal);
