import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import {
  Panel,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
  ButtonToolbar,
  Grid,
  Row,
  Col,
  Schema,
  Notification,
  SelectPicker,
} from 'rsuite';
import Translation from 'app/modules/core/ui/components/Translation';
import DocumentUpload from 'app/modules/uploads/ui/components/DocumentUpload';
import TemplatesHelper from 'modules/templates/ui/helpers/TemplatesHelper';

const { StringType } = Schema.Types;

class MyProfile extends React.Component {
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
    this.onDocumentDrop = this.onDocumentDrop.bind(this);
  }

  componentDidMount() {
    const { countriesStore, usersStore } = this.props;
    usersStore.loadUser();
    countriesStore.loadAll();
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
    const { uploadsStore, usersStore, authStore } = this.props;
    uploadsStore.uploadUserDocument(files[0], documentType).then(() => {
      usersStore.loadUser();
      authStore.loadUserAuth();
    });
  }

  render() {
    const { usersStore, countriesStore, templatesStore } = this.props;
    const Template = TemplatesHelper.getDefaultTemplate({ templatesStore });
    let pageTitle = 'My Personal Profile';
    let descriptionTitle = 'Bio';
    if (usersStore.user.businessAccount) {
      pageTitle = 'My Business Profile';
      descriptionTitle = 'Description of the Business';
    }
    return (
      <Template className="my-profile-page">
        <Grid fluid>
          <Row>
            <Col sm={24} md={16} mdOffset={4}>
              <h1>
                <Translation message={pageTitle} />
              </h1>
              <Panel className="my-profile-panel" bordered>
                <Form
                  fluid
                  ref={this.form}
                  onChange={usersStore.setUserData}
                  onCheck={usersStore.setUserError}
                  formValue={usersStore.user}
                  formError={usersStore.userError}
                  checkTrigger="blur"
                  model={this.model}
                  onSubmit={this.handleSubmit}
                  autoComplete="off"
                  className="my-profile"
                >
                  <Row>
                    <Col xs={24} md={8}>
                      <FormGroup>
                        <ControlLabel>
                          <Translation message="Profile Picture" />
                        </ControlLabel>
                        <DocumentUpload
                          className="profile-picture-upload"
                          onFileDrop={this.onDocumentDrop.bind(this, 'profilePicture')}
                          documentName="profilePicture"
                          currentDocument={usersStore.user.profilePicture}
                          imageSize="md"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  {!usersStore.user.businessAccount && (
                    <Row>
                      <Col xs={24} md={12}>
                        <FormGroup>
                          <ControlLabel>
                            <Translation message="First Name" />
                          </ControlLabel>
                          <FormControl name="firstName" type="text" onKeyDown={this.onInputKeyDown} />
                        </FormGroup>
                      </Col>
                      <Col xs={24} md={12}>
                        <FormGroup>
                          <ControlLabel>
                            <Translation message="Last Name" />
                          </ControlLabel>
                          <FormControl name="lastName" type="text" onKeyDown={this.onInputKeyDown} />
                        </FormGroup>
                      </Col>
                    </Row>
                  )}
                  {usersStore.user.businessAccount && (
                    <Row>
                      <Col xs={24}>
                        <FormGroup>
                          <ControlLabel>
                            <Translation message="Company Name" />
                          </ControlLabel>
                          <FormControl name="companyName" type="text" onKeyDown={this.onInputKeyDown} />
                        </FormGroup>
                      </Col>
                    </Row>
                  )}
                  <Row>
                    <Col xs={24} md={12}>
                      <FormGroup>
                        <ControlLabel>
                          <Translation message="Email" />
                        </ControlLabel>
                        <FormControl name="email" type="email" autoComplete="off" onKeyDown={this.onInputKeyDown} />
                      </FormGroup>
                    </Col>
                    <Col xs={24} md={12}>
                      <FormGroup>
                        <ControlLabel>
                          <Translation message="New Password" />
                        </ControlLabel>
                        <FormControl
                          name="newPassword"
                          type="password"
                          autoComplete="off"
                          onKeyDown={this.onInputKeyDown}
                        />
                      </FormGroup>
                    </Col>
                    <Col xs={24} md={12}>
                      <FormGroup>
                        <ControlLabel>
                          <Translation message="Street Address" />
                        </ControlLabel>
                        <FormControl name="street" type="text" onKeyDown={this.onInputKeyDown} />
                      </FormGroup>
                    </Col>
                    <Col xs={24} md={12}>
                      <FormGroup>
                        <ControlLabel>
                          <Translation message="City" />
                        </ControlLabel>
                        <FormControl name="city" type="text" onKeyDown={this.onInputKeyDown} />
                      </FormGroup>
                    </Col>
                    <Col xs={24} md={12}>
                      <FormGroup>
                        <ControlLabel>
                          <Translation message="State" />
                        </ControlLabel>
                        <FormControl name="state" type="text" onKeyDown={this.onInputKeyDown} />
                      </FormGroup>
                    </Col>
                    <Col xs={24} md={12}>
                      <FormGroup>
                        <ControlLabel>
                          <Translation message="Country" />
                        </ControlLabel>
                        <FormControl name="country" accepter={SelectPicker} data={countriesStore.countriesSelect} />
                      </FormGroup>
                    </Col>
                    <Col xs={24} md={12}>
                      <FormGroup>
                        <ControlLabel>
                          <Translation message="ZIP Code" />
                        </ControlLabel>
                        <FormControl name="postCode" type="text" onKeyDown={this.onInputKeyDown} />
                      </FormGroup>
                    </Col>
                    <Col xs={24} md={12}>
                      <FormGroup>
                        <ControlLabel>
                          <Translation message="Phone Number" />
                        </ControlLabel>
                        <FormControl name="phone" type="text" onKeyDown={this.onInputKeyDown} />
                      </FormGroup>
                    </Col>
                    <Col xs={24}>
                      <FormGroup>
                        <ControlLabel>
                          <Translation message="Website" />
                        </ControlLabel>
                        <FormControl name="website" type="text" onKeyDown={this.onInputKeyDown} />
                      </FormGroup>
                    </Col>
                    <Col xs={24}>
                      <FormGroup>
                        <ControlLabel>
                          <Translation message={descriptionTitle} />
                        </ControlLabel>
                        <FormControl name="description" componentClass="textarea" />
                      </FormGroup>
                    </Col>
                  </Row>
                  {usersStore.user.businessAccount && (
                    <Row>
                      <Col xs={24}>
                        <div className="legal-representative">
                          <Translation message="Legal Representative" />
                        </div>
                        <div className="v-spacer-3" />
                      </Col>
                      <Col xs={24} md={12}>
                        <FormGroup>
                          <ControlLabel>
                            <Translation message="First Name" />
                          </ControlLabel>
                          <FormControl name="firstName" type="text" onKeyDown={this.onInputKeyDown} />
                        </FormGroup>
                      </Col>
                      <Col xs={24} md={12}>
                        <FormGroup>
                          <ControlLabel>
                            <Translation message="Last Name" />
                          </ControlLabel>
                          <FormControl name="lastName" type="text" onKeyDown={this.onInputKeyDown} />
                        </FormGroup>
                      </Col>
                    </Row>
                  )}
                  <Row>
                    <Col xs={24}>
                      <FormGroup>
                        <ButtonToolbar>
                          <Button className="pull-right" appearance="primary" onClick={this.handleSubmit}>
                            <Translation message="Save" />
                          </Button>
                        </ButtonToolbar>
                      </FormGroup>
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

MyProfile.propTypes = {
  usersStore: PropTypes.object.isRequired,
  authStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
  countriesStore: PropTypes.object.isRequired,
  uploadsStore: PropTypes.object.isRequired,
  templatesStore: PropTypes.object.isRequired,
  history: PropTypes.object,
};

const enhance = compose(
  withRouter,
  inject('usersStore', 'authStore', 'localeStore', 'countriesStore', 'uploadsStore', 'templatesStore'),
  observer
);

export default enhance(MyProfile);
