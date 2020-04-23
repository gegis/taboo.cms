import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import { Panel, Form, Message, Grid, Row, Col, Schema, Notification, Icon } from 'rsuite';
import Translation from 'app/modules/core/ui/components/Translation';
import DocumentUpload from 'app/modules/uploads/ui/components/DocumentUpload';

const { StringType } = Schema.Types;

class AccountVerification extends React.Component {
  constructor(props) {
    super(props);
    const { usersStore } = props;
    this.model = Schema.Model({
      firstName: StringType().isRequired('First Name is required.'),
      lastName: StringType().isRequired('Last Name is required.'),
      street: StringType().isRequired('Street is required.'),
      city: StringType().isRequired('City is required.'),
      state: StringType().isRequired('State is required.'),
      country: StringType().isRequired('Country is required.'),
      postCode: StringType().isRequired('Zip Code is required.'),
      email: StringType()
        .isEmail('Please enter a valid email address.')
        .isRequired('Email address is required.'),
      password: StringType().minLength(5, 'Password must be at least 5 characters long'),
      companyName: StringType().addRule(value => {
        if (usersStore.user.businessAccount && !value) {
          return false;
        }
        return true;
      }, 'Company name is required.'),
    });
    this.form = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onInputKeyDown = this.onInputKeyDown.bind(this);
  }

  componentDidMount() {
    const { usersStore } = this.props;
    usersStore.loadUser();
  }

  handleSubmit() {
    const { localeStore, usersStore } = this.props;
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
          Notification.info({
            title: 'Success',
            description: localeStore.getTranslation('Successfully saved'),
            duration: 15000,
          });
        }
      });
    }
  }

  onInputKeyDown(event) {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  }

  onDocumentDrop(documentType, files = []) {
    const { uploadsStore, usersStore } = this.props;
    uploadsStore.uploadUserDocument(files[0], documentType).then(() => {
      usersStore.loadUser();
    });
  }

  getVerificationNotes() {
    const { usersStore } = this.props;
    let failedNotes = [];
    let notes = [];
    if (usersStore.user.verificationNote) {
      failedNotes = usersStore.user.verificationNote.split('\n');
      failedNotes.map((note, i) => {
        notes.push(
          <div className="text-sm" key={`note-${i}`}>
            <Icon icon="exclamation-circle" className="color-error" /> {note}
          </div>
        );
      });
    }
    return notes;
  }

  getVerificationMessage() {
    const { usersStore } = this.props;
    const verificationStatusToMessageType = {
      new: 'error',
      pending: 'warning',
      failed: 'error',
      approved: 'info',
    };
    let message = null;
    let messageType;
    let description;
    if (usersStore.user.verified) {
      message = <Message type="info" description={<Translation message={'verification_status_approved'} />} />;
    } else if (usersStore.user.verificationStatus) {
      messageType = verificationStatusToMessageType[usersStore.user.verificationStatus];
      description = <Translation message={`verification_status_${usersStore.user.verificationStatus}`} />;
      if (usersStore.user.verificationStatus === 'failed') {
        description = (
          <div>
            <Translation message={`verification_status_${usersStore.user.verificationStatus}`} />
            {this.getVerificationNotes()}
          </div>
        );
      }
      message = <Message type={messageType} description={description} />;
    }

    return message;
  }

  render() {
    const {
      usersStore,
      uploadsStore,
      templatesStore: { templateComponents = {}, defaultTemplateName = '' } = {},
    } = this.props;
    const Template = templateComponents[defaultTemplateName];

    return (
      <Template className="account-verification-page">
        <Grid fluid>
          <Row>
            <Col xs={24} md={16} mdOffset={4}>
              <h1>Account Verification</h1>
              <Panel className="account-verification-panel" bordered>
                <h3>Status</h3>
                {this.getVerificationMessage()}
                <Form
                  fluid
                  ref={this.form}
                  onChange={uploadsStore.setUserData}
                  onCheck={uploadsStore.setUserError}
                  formValue={uploadsStore.documents}
                  formError={uploadsStore.userError}
                  checkTrigger="blur"
                  model={this.model}
                  onSubmit={this.handleSubmit}
                  autoComplete="off"
                  className="account-verification"
                >
                  {usersStore.user.businessAccount && (
                    <Row>
                      <Col sm={24}>
                        <h5>Certificate of Incorporation</h5>
                        <div className="text-sm">Upload a clear image of the Certificate of Incorporation</div>
                      </Col>
                      <Col sm={24} md={11} mdOffset={7}>
                        <DocumentUpload
                          onFileDrop={this.onDocumentDrop.bind(this, 'documentIncorporation')}
                          documentName="documentIncorporation"
                          currentDocument={usersStore.user.documentIncorporation}
                        />
                      </Col>
                      <Col sm={24}>
                        <div className="divider"> </div>
                        <h5>Legal Representative</h5>
                        <div className="">
                          {usersStore.user.firstName} {usersStore.user.lastName}
                        </div>
                      </Col>
                    </Row>
                  )}
                  <Row>
                    <Col sm={24}>
                      <h3>ID Card</h3>
                      <p>Upload clear images of the front and back side</p>
                    </Col>
                    <Col sm={24} md={11}>
                      <DocumentUpload
                        title="Front Side"
                        onFileDrop={this.onDocumentDrop.bind(this, 'documentPersonal1')}
                        documentName="documentPersonal1"
                        currentDocument={usersStore.user.documentPersonal1}
                      />
                    </Col>
                    <Col sm={24} md={2}>
                      {' '}
                    </Col>
                    <Col sm={24} md={11}>
                      <DocumentUpload
                        title="Back Side"
                        onFileDrop={this.onDocumentDrop.bind(this, 'documentPersonal2')}
                        documentName="documentPersonal2"
                        currentDocument={usersStore.user.documentPersonal2}
                      />
                    </Col>
                  </Row>
                </Form>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </Template>
    );
  }
}

AccountVerification.propTypes = {
  usersStore: PropTypes.object.isRequired,
  authStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
  uploadsStore: PropTypes.object.isRequired,
  templatesStore: PropTypes.object.isRequired,
  history: PropTypes.object,
};

const enhance = compose(
  withRouter,
  inject('usersStore', 'authStore', 'localeStore', 'uploadsStore', 'templatesStore'),
  observer
);

export default enhance(AccountVerification);