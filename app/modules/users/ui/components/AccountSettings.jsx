import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import {
  HelpBlock,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
  Grid,
  Row,
  Col,
  Notification,
  SelectPicker,
  Icon,
} from 'rsuite';
import Translation from 'app/modules/core/ui/components/Translation';
import DocumentUpload from 'app/modules/uploads/ui/components/DocumentUpload';
import TemplatesHelper from 'modules/templates/ui/helpers/TemplatesHelper';
import Modal from 'modules/core/ui/components/Modal';
import UsersHelper from 'modules/users/ui/helpers/UsersHelper';

class AccountSettings extends React.Component {
  constructor(props) {
    super(props);
    this.formValidation = UsersHelper.getUserFormValidation();
    this.form = React.createRef();
    this.modal = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onInputKeyDown = this.onInputKeyDown.bind(this);
    this.onDocumentDrop = this.onDocumentDrop.bind(this);
    this.onDeactivateAccount = this.onDeactivateAccount.bind(this);
    this.deactivateAccount = this.deactivateAccount.bind(this);
    this.cancel = this.cancel.bind(this);
    this.resendVerification = this.resendVerification.bind(this);
  }

  componentDidMount() {
    const { countriesStore, usersStore } = this.props;
    usersStore.loadUser();
    countriesStore.loadAll();
  }

  handleSubmit() {
    const { localeStore, usersStore, authStore } = this.props;
    const userData = Object.assign({}, usersStore.user);
    if (Object.prototype.hasOwnProperty.call(userData, 'profilePicture')) {
      delete userData.profilePicture;
    }
    if (!this.form.current.check()) {
      Notification.error({
        title: 'Invalid Data',
        description: localeStore.getTranslation('Please check all the fields'),
        duration: 10000,
      });
    } else {
      usersStore.saveUser(userData).then(data => {
        if (data && data._id) {
          authStore.loadUserAuth();
          Notification.info({
            title: 'Success',
            description: localeStore.getTranslation('Successfully saved'),
            duration: 15000,
          });
        }
      });
    }
  }

  cancel() {
    const { usersStore } = this.props;
    usersStore.loadUser();
  }

  onInputKeyDown(event) {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  }

  onDocumentDrop(documentName, files = []) {
    const { uploadsStore, usersStore, authStore } = this.props;
    uploadsStore.uploadUserDocument(files[0], documentName).then(() => {
      usersStore.loadUser();
      authStore.loadUserAuth();
    });
  }

  onDeactivateAccount() {
    const { current } = this.modal;
    if (current) {
      current.open();
    }
  }

  deactivateAccount() {
    const { usersStore, uiStore } = this.props;
    uiStore.setLoading(true);
    usersStore.deactivateUser().then(data => {
      uiStore.setLoading(false);
      if (data) {
        Notification.info({
          title: 'Success',
          description: 'Account has been deactivated',
          duration: 15000,
        });
        this.logoutUser();
      }
    });
  }

  resendVerification() {
    const { usersStore, uiStore, notificationsStore } = this.props;
    const { user: { email } = {} } = usersStore;
    uiStore.setLoading(true);
    usersStore.resendVerification().then(data => {
      uiStore.setLoading(false);
      if (data && data.success) {
        notificationsStore.push({
          title: 'Success',
          html: 'Verification successfully sent to {email}.',
          translationVars: { email: email },
          translate: true,
        });
      } else {
        notificationsStore.push({
          type: 'error',
          title: 'Error',
          html: 'Verification send has failed.',
          translate: true,
        });
      }
    });
  }

  logoutUser() {
    const { usersStore, authStore, history } = this.props;
    usersStore.logoutUser(authStore).then(data => {
      if (data && data.success) {
        authStore.loadUserAuth().then(() => {
          return history.push('/');
        });
      } else {
        throw new Error('Error logging out');
      }
    });
  }

  render() {
    const { usersStore, countriesStore, templatesStore, authStore } = this.props;
    const { emailVerified = false } = authStore;
    const Template = TemplatesHelper.getDefaultTemplate({ templatesStore });
    return (
      <Template
        className="account-settings-page"
        title="Account Settings"
        metaTitle="Account Settings"
        headerMinimized={true}
      >
        <Grid>
          <Row>
            <Col sm={24} md={12} mdOffset={6}>
              <Form
                fluid
                ref={this.form}
                onChange={usersStore.setUserData}
                onCheck={usersStore.setUserError}
                formValue={usersStore.user}
                formError={usersStore.userError}
                checkTrigger="change"
                model={this.formValidation}
                onSubmit={this.handleSubmit}
                autoComplete="off"
                className="form account-settings"
              >
                <FormGroup>
                  <ControlLabel>
                    <Translation message="Profile Picture" />
                  </ControlLabel>
                  <DocumentUpload
                    className="profile-picture-upload"
                    onFileDrop={this.onDocumentDrop.bind(this, 'profilePicture')}
                    documentName="profilePicture"
                    currentDocument={usersStore.user.profilePicture}
                    imageSize="xl"
                  />
                </FormGroup>
                <FormGroup controlId="firstName">
                  <ControlLabel>
                    <Translation message="First Name" />
                  </ControlLabel>
                  <FormControl name="firstName" autoComplete="off" onKeyDown={this.onInputKeyDown} />
                </FormGroup>
                <FormGroup controlId="lastName">
                  <ControlLabel>
                    <Translation message="Last Name" />
                  </ControlLabel>
                  <FormControl name="lastName" autoComplete="off" onKeyDown={this.onInputKeyDown} />
                </FormGroup>
                <FormGroup controlId="email">
                  <ControlLabel>
                    <Translation message="Email" />
                  </ControlLabel>
                  <FormControl name="email" type="email" autoComplete="off" onKeyDown={this.onInputKeyDown} />
                </FormGroup>
                <FormGroup controlId="password">
                  <ControlLabel>
                    <Translation message="New Password" />
                  </ControlLabel>
                  <FormControl
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    onKeyDown={this.onInputKeyDown}
                  />
                  <HelpBlock>Leave it empty if you don&apos;t want to change it</HelpBlock>
                </FormGroup>
                <FormGroup controlId="country">
                  <ControlLabel>
                    <Translation message="Country" />
                  </ControlLabel>
                  <FormControl name="country" accepter={SelectPicker} data={countriesStore.allCountriesOptions} />
                </FormGroup>
                <FormGroup className="form-submit-wrapper">
                  <div className="pull-left">
                    <Button appearance="ghost" onClick={this.cancel}>
                      Cancel
                    </Button>
                  </div>
                  <div className="pull-right">
                    <Button appearance="primary" onClick={this.handleSubmit}>
                      Save
                    </Button>
                  </div>
                  <div className="clearfix" />
                </FormGroup>
                {!emailVerified && (
                  <div>
                    <hr />
                    <FormGroup className="resend-verification-wrapper">
                      <div className="pull-left">
                        <ControlLabel>Email Not Verified</ControlLabel>
                      </div>
                      <div className="pull-right">
                        <Button appearance="primary" className="resend-verification" onClick={this.resendVerification}>
                          Send Again
                        </Button>
                      </div>
                      <div className="clearfix" />
                    </FormGroup>
                  </div>
                )}
                <hr />
                <FormGroup className="deactivate-account-wrapper">
                  <div className="pull-left">
                    <ControlLabel>Deactivate Account</ControlLabel>
                  </div>
                  <div className="pull-right">
                    <Button appearance="link" className="deactivate-account-link" onClick={this.onDeactivateAccount}>
                      <Icon icon="trash" /> Deactivate Account
                    </Button>
                  </div>
                  <div className="clearfix" />
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </Grid>
        <Modal
          ref={this.modal}
          className="deactivate-account-modal"
          title="Deactivate Account"
          onSubmit={this.deactivateAccount}
          submitName="Deactivate"
          size="xs"
        >
          <div className="v-spacer-5" />
          <p>It will permanently delete your account and all of the related information to your account.</p>
        </Modal>
      </Template>
    );
  }
}

AccountSettings.propTypes = {
  usersStore: PropTypes.object.isRequired,
  authStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
  countriesStore: PropTypes.object.isRequired,
  uploadsStore: PropTypes.object.isRequired,
  templatesStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
  uiStore: PropTypes.object.isRequired,
  history: PropTypes.object,
};

const enhance = compose(
  withRouter,
  inject(
    'usersStore',
    'authStore',
    'localeStore',
    'countriesStore',
    'uploadsStore',
    'templatesStore',
    'uiStore',
    'notificationsStore'
  ),
  observer
);

export default enhance(AccountSettings);
