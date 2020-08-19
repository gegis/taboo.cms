import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import {
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
  Grid,
  Row,
  Col,
  Notification,
  Checkbox,
  SelectPicker,
} from 'rsuite';
import Translation from 'app/modules/core/ui/components/Translation';
import SocketsClient from 'modules/core/ui/helpers/SocketsClient';
import UsersHelper from 'modules/users/ui/helpers/UsersHelper';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    // TODO move this Schema.Model into helper to be reused in my-profile as well!!!
    // TODO Also have all min max lengths in configs!!!
    this.formValidation = UsersHelper.getSignUpFormValidation();
    this.form = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onInputKeyDown = this.onInputKeyDown.bind(this);
  }

  componentDidMount() {
    const { countriesStore } = this.props;
    countriesStore.loadAll();
  }

  handleSubmit() {
    const { usersStore, uiStore } = this.props;
    const { signupUser } = usersStore;
    if (!this.form.current.check()) {
      Notification.error({
        title: 'Invalid Data',
        description: 'Please check all the fields',
        duration: 10000,
      });
    } else if (!signupUser.agreeToTerms) {
      Notification.error({
        title: 'Invalid Data',
        description: 'You must agree with Terms & Conditions',
        duration: 10000,
      });
    } else {
      uiStore.setLoading(true);
      usersStore.registerUser().then(data => {
        uiStore.setLoading(false);
        if (data && data._id) {
          this.loginUser(usersStore.signupUser.email, usersStore.signupUser.password);
        }
      });
    }
  }

  loginUser(email, password) {
    const { usersStore, authStore, history } = this.props;
    authStore.loginUser(email, password).then(data => {
      if (data) {
        usersStore.resetSignupUser();
        authStore.loadUserAuth().then(user => {
          const userUpdateEvent = UsersHelper.getUserEventName('update', authStore);
          if (user) {
            SocketsClient.off(userUpdateEvent);
            SocketsClient.join('users').then(() => {
              SocketsClient.on(userUpdateEvent, () => {
                authStore.loadUserAuth();
              });
            });
            return history.push('/my-profile');
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
    const { authStore, usersStore, countriesStore, templatesStore } = this.props;
    const { setSignupUserCheckboxValue } = usersStore;
    const { templateComponents } = templatesStore;
    const Template = templateComponents[templatesStore.defaultTemplateName];

    if (authStore && authStore.authenticated) {
      return <Redirect to="/dashboard" />;
    }

    return (
      <Template className="sign-up-page" metaTitle="Sign Up" title="Sign Up" headerMinimized={true}>
        <Grid fluid>
          <Row>
            <Col xs={24} md={12} mdOffset={6}>
              <Form
                fluid
                ref={this.form}
                onChange={usersStore.setSignupUserData}
                onCheck={usersStore.setSignupUserError}
                formValue={usersStore.signupUser}
                formError={usersStore.signupUserError}
                checkTrigger="change"
                model={this.formValidation}
                onSubmit={this.handleSubmit}
                className="form"
                autoComplete="off"
              >
                <h1>Create Account</h1>
                <FormGroup controlId="username">
                  <ControlLabel>
                    <Translation message="Username" />
                  </ControlLabel>
                  <FormControl name="username" autoComplete="off" type="text" onKeyDown={this.onInputKeyDown} />
                </FormGroup>
                <FormGroup controlId="email">
                  <ControlLabel>
                    <Translation message="Email" />
                  </ControlLabel>
                  <FormControl name="email" type="email" autoComplete="off" onKeyDown={this.onInputKeyDown} />
                </FormGroup>
                <FormGroup controlId="password">
                  <ControlLabel>
                    <Translation message="Password" />
                  </ControlLabel>
                  <FormControl
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    onKeyDown={this.onInputKeyDown}
                  />
                </FormGroup>
                <FormGroup controlId="country">
                  <ControlLabel>
                    <Translation message="Country" />
                  </ControlLabel>
                  <FormControl name="country" accepter={SelectPicker} data={countriesStore.allCountriesOptions} />
                </FormGroup>
                <FormGroup className="user-agreement">
                  <Checkbox
                    name="agreeToAll"
                    onChange={setSignupUserCheckboxValue.bind(null, 'agreeToAll')}
                    checked={usersStore.signupUser.agreeToAll}
                  >
                    I agree to All
                  </Checkbox>
                  <Checkbox
                    name="agreeToTerms"
                    onChange={setSignupUserCheckboxValue.bind(null, 'agreeToTerms')}
                    checked={usersStore.signupUser.agreeToTerms}
                  >
                    I agree to{' '}
                    <a target="_blank" href="/terms-and-conditions">
                      Terms & Conditions
                    </a>
                  </Checkbox>
                  <Checkbox
                    name="agreeToRewards"
                    onChange={setSignupUserCheckboxValue.bind(null, 'agreeToRewards')}
                    checked={usersStore.signupUser.agreeToRewards}
                  >
                    I agree to{' '}
                    <a target="_blank" href="/terms-and-conditions">
                      Rewards & Offers
                    </a>
                  </Checkbox>
                </FormGroup>
                <FormGroup className="form-submit-wrapper">
                  <Button appearance="primary" className="btn-huge" onClick={this.handleSubmit}>
                    Create Account
                  </Button>
                </FormGroup>
                <div className="clearfix" />
              </Form>
            </Col>
          </Row>
        </Grid>
      </Template>
    );
  }
}

SignUp.propTypes = {
  usersStore: PropTypes.object.isRequired,
  authStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
  countriesStore: PropTypes.object.isRequired,
  templatesStore: PropTypes.object.isRequired,
  uiStore: PropTypes.object.isRequired,
  history: PropTypes.object,
};

const enhance = compose(
  withRouter,
  inject('usersStore', 'authStore', 'localeStore', 'countriesStore', 'templatesStore', 'uiStore'),
  observer
);

export default enhance(SignUp);
