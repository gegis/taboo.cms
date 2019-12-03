import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
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
  RadioGroup,
  Radio,
  Checkbox,
  SelectPicker,
} from 'rsuite';
import Translation from 'app/modules/core/client/components/Translation';
import Layout from 'app/modules/core/client/components/Layout';

const { StringType } = Schema.Types;

class SignUp extends React.Component {
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
      password: StringType()
        .isRequired('Password is required.')
        .minLength(5, 'Password must be at least 5 characters long'),
      companyName: StringType().addRule(value => {
        if (usersStore.accountType === 'business' && !value) {
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
    const { countriesStore } = this.props;
    countriesStore.loadAll();
  }

  handleSubmit() {
    const { localeStore, usersStore } = this.props;
    if (!this.form.current.check()) {
      Notification.error({
        title: 'Invalid Data',
        description: localeStore.getTranslation('Please check all the fields'),
        duration: 10000,
      });
    } else if (!usersStore.userAgreement) {
      Notification.error({
        title: 'Invalid Data',
        description: localeStore.getTranslation('You have to agree with terms and conditions'),
        duration: 15000,
      });
    } else {
      usersStore.registerUser().then(data => {
        if (data && data._id) {
          this.loginUser(usersStore.signupUser.email, usersStore.signupUser.password);
        }
      });
    }
  }

  loginUser(email, password) {
    const { usersStore, authStore, history, navigationStore } = this.props;
    authStore.loginUser(email, password).then(data => {
      if (data) {
        usersStore.resetSignupUser();
        navigationStore.loadNavigationByType('user');
        authStore.loadUserAuth().then(user => {
          if (user) {
            return history.push('/dashboard');
          } else {
            return history.push('/');
          }
        });
      }
    });
  }

  onInputKeyDown(event) {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  }

  render() {
    const { authStore, usersStore, countriesStore } = this.props;

    if (authStore && authStore.authenticated) {
      return <Redirect to="/dashboard" />;
    }

    return (
      <Layout className="sign-up-page">
        <Grid fluid>
          <Row>
            <Col xs={24} md={16} mdOffset={4}>
              <h1>
                <Translation message="Create your account" />
              </h1>
              <div className="account-type">
                <RadioGroup
                  inline
                  name="accountType"
                  value={usersStore.accountType}
                  onChange={usersStore.setAccountType}
                >
                  <Radio value="personal">Personal</Radio>
                  <Radio value="business">Business</Radio>
                </RadioGroup>
              </div>
              <Panel className="login-panel shadow" bordered>
                <Form
                  fluid
                  ref={this.form}
                  onChange={usersStore.setSignupUserData}
                  onCheck={usersStore.setSignupUserError}
                  formValue={usersStore.signupUser}
                  formError={usersStore.signupUserError}
                  checkTrigger="blur"
                  model={this.model}
                  onSubmit={this.handleSubmit}
                  autoComplete="off"
                >
                  {usersStore.accountType === 'personal' && (
                    <Row>
                      <Col sm={24} md={12}>
                        <FormGroup>
                          <ControlLabel>
                            <Translation message="First Name" />
                          </ControlLabel>
                          <FormControl name="firstName" type="text" onKeyDown={this.onInputKeyDown} />
                        </FormGroup>
                      </Col>
                      <Col sm={24} md={12}>
                        <FormGroup>
                          <ControlLabel>
                            <Translation message="Last Name" />
                          </ControlLabel>
                          <FormControl name="lastName" type="text" onKeyDown={this.onInputKeyDown} />
                        </FormGroup>
                      </Col>
                    </Row>
                  )}
                  {usersStore.accountType === 'business' && (
                    <Row>
                      <Col sm={24}>
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
                    <Col sm={24}>
                      <FormGroup>
                        <ControlLabel>
                          <Translation message="Email" />
                        </ControlLabel>
                        <FormControl name="email" type="email" autoComplete="off" onKeyDown={this.onInputKeyDown} />
                      </FormGroup>
                    </Col>
                    <Col sm={24}>
                      <FormGroup>
                        <ControlLabel>
                          <Translation message="Password" />
                        </ControlLabel>
                        <FormControl
                          name="password"
                          type="password"
                          autoComplete="off"
                          onKeyDown={this.onInputKeyDown}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm={24}>
                      <FormGroup>
                        <ControlLabel>
                          <Translation message="Street Address" />
                        </ControlLabel>
                        <FormControl name="street" type="text" onKeyDown={this.onInputKeyDown} />
                      </FormGroup>
                    </Col>
                    <Col sm={24} md={12}>
                      <FormGroup>
                        <ControlLabel>
                          <Translation message="City" />
                        </ControlLabel>
                        <FormControl name="city" type="text" onKeyDown={this.onInputKeyDown} />
                      </FormGroup>
                    </Col>
                    <Col sm={24} md={12}>
                      <FormGroup>
                        <ControlLabel>
                          <Translation message="State" />
                        </ControlLabel>
                        <FormControl name="state" type="text" onKeyDown={this.onInputKeyDown} />
                      </FormGroup>
                    </Col>
                    <Col sm={24} md={12}>
                      <FormGroup>
                        <ControlLabel>
                          <Translation message="Country" />
                        </ControlLabel>
                        <FormControl name="country" accepter={SelectPicker} data={countriesStore.countriesSelect} />
                      </FormGroup>
                    </Col>
                    <Col sm={24} md={12}>
                      <FormGroup>
                        <ControlLabel>
                          <Translation message="ZIP Code" />
                        </ControlLabel>
                        <FormControl name="postCode" type="text" onKeyDown={this.onInputKeyDown} />
                      </FormGroup>
                    </Col>
                  </Row>
                  {usersStore.accountType === 'business' && (
                    <Row>
                      <Col sm={24}>
                        <div className="legal-representative">
                          <Translation message="Legal Representative" />
                        </div>
                        <div className="v-spacer-2" />
                      </Col>
                      <Col sm={24} md={12}>
                        <FormGroup>
                          <ControlLabel>
                            <Translation message="First Name" />
                          </ControlLabel>
                          <FormControl name="firstName" type="text" onKeyDown={this.onInputKeyDown} />
                        </FormGroup>
                      </Col>
                      <Col sm={24} md={12}>
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
                    <Col sm={24}>
                      <FormGroup className="user-agreement">
                        <Checkbox
                          name="userAgreement"
                          onChange={usersStore.setUserAgreement}
                          value={usersStore.userAgreement}
                        >
                          I agree to{' '}
                          <a target="_blank" href="/user-agreement">
                            User Agreement
                          </a>{' '}
                          and{' '}
                          <a target="_blank" href="/privacy-policy">
                            Privacy Policy
                          </a>
                        </Checkbox>
                      </FormGroup>
                    </Col>
                  </Row>
                  <FormGroup>
                    <ButtonToolbar>
                      <Button appearance="primary" className="pull-right" onClick={this.handleSubmit}>
                        <Translation message="Sign up" />
                      </Button>
                    </ButtonToolbar>
                  </FormGroup>
                  <div className="clearfix" />
                </Form>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </Layout>
    );
  }
}

SignUp.propTypes = {
  usersStore: PropTypes.object.isRequired,
  authStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
  countriesStore: PropTypes.object.isRequired,
  navigationStore: PropTypes.object.isRequired,
  history: PropTypes.object,
};

const enhance = compose(
  withRouter,
  inject('usersStore', 'authStore', 'localeStore', 'countriesStore', 'navigationStore'),
  observer
);

export default enhance(SignUp);
