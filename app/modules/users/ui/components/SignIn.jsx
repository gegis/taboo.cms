import React from 'react';
import { Redirect, withRouter, Link } from 'react-router-dom';
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
  Schema,
  Notification,
  Nav,
  Checkbox,
} from 'rsuite';
import Translation from 'app/modules/core/ui/components/Translation';
import NavLink from 'app/modules/core/ui/components/NavLink';
import SocketsClient from 'app/modules/core/ui/helpers/SocketsClient';
import TemplatesHelper from 'modules/templates/ui/helpers/TemplatesHelper';
import UsersHelper from 'modules/users/ui/helpers/UsersHelper';

const { StringType } = Schema.Types;

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    const formValue = {
      email: '',
      password: '',
      rememberMe: false,
    };
    this.state = {
      formValue: formValue,
      formError: {},
    };
    this.model = Schema.Model({
      email: StringType()
        .isEmail('Please enter a valid email address.')
        .isRequired('Email address is required.'),
      password: StringType().isRequired('Password is required.'),
    });
    this.form = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onFormChange = this.onFormChange.bind(this);
    this.onFormCheck = this.onFormCheck.bind(this);
    this.onInputKeyDown = this.onInputKeyDown.bind(this);
  }

  handleSubmit() {
    const { authStore, localeStore, history } = this.props;
    const { email, password, rememberMe } = this.state.formValue;
    if (!this.form.current.check()) {
      Notification.error({
        title: 'Form Validation',
        description: localeStore.getTranslation('Please check all the fields'),
        duration: 5000,
      });
      return;
    }
    authStore.loginUser(email, password, rememberMe).then(data => {
      if (data) {
        authStore.loadUserAuth().then(user => {
          const userUpdateEvent = UsersHelper.getUserEventName('update', authStore);
          if (user) {
            // TODO might need SocketsClient.leave on sign out.
            // In case if user had to sign in, we register event with his id
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

  onFormChange(formValue) {
    this.setState({ formValue });
  }

  onFormCheckboxChange(field, event, value) {
    const { formValue } = this.state;
    formValue[field] = value;
    this.setState({ formValue });
  }

  onFormCheck(formError) {
    this.setState({ formError });
  }

  onInputKeyDown(event) {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  }

  getTopRightMenu() {
    return (
      <Nav className="top-right-links" pullRight>
        <NavLink className="rs-nav-item-content" to="/sign-up">
          Sign Up
        </NavLink>
      </Nav>
    );
  }

  render() {
    const { authStore, templatesStore } = this.props;
    const Template = TemplatesHelper.getDefaultTemplate({ templatesStore });
    const { formValue, formError } = this.state;

    if (authStore && authStore.authenticated) {
      return <Redirect to="/dashboard" />;
    }

    return (
      <Template
        className="sign-in-page"
        metaTitle="Login"
        title="Login"
        headerMinimized={true}
        topRightMenu={this.getTopRightMenu()}
      >
        <Grid fluid>
          <Row>
            <Col xs={24} md={12} mdOffset={6}>
              <Form
                fluid
                ref={this.form}
                className="form"
                onChange={this.onFormChange}
                onCheck={this.onFormCheck}
                formValue={formValue}
                formError={formError}
                checkTrigger="blur"
                model={this.model}
                onSubmit={this.handleSubmit}
              >
                <h1>Login</h1>
                <FormGroup>
                  <ControlLabel>
                    <Translation message="Email" />
                  </ControlLabel>
                  <FormControl name="email" type="email" onKeyDown={this.onInputKeyDown} />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>
                    <Translation message="Password" />
                  </ControlLabel>
                  <FormControl name="password" type="password" onKeyDown={this.onInputKeyDown} />
                </FormGroup>
                <FormGroup>
                  <Checkbox
                    name="rememberMe"
                    checked={formValue.rememberMe}
                    onChange={this.onFormCheckboxChange.bind(this, 'rememberMe')}
                  >
                    Remember Me
                  </Checkbox>
                </FormGroup>
                <FormGroup>
                  <Button appearance="primary" className="btn-huge" onClick={this.handleSubmit}>
                    <Translation message="Login" />
                  </Button>
                </FormGroup>
                <FormGroup className="form-footer-links">
                  <div className="pull-left">
                    <Link className="form-action-link" to="/reset-password">
                      <Translation message="Forgot password?" />
                    </Link>
                  </div>
                  <div className="pull-right">
                    Don&apos;t have an account yet?{' '}
                    <Link className="form-action-link" to="/sign-up">
                      Create Account
                    </Link>
                  </div>
                  <div className="clearfix" />
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </Grid>
      </Template>
    );
  }
}

SignIn.propTypes = {
  authStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
  templatesStore: PropTypes.object.isRequired,
  history: PropTypes.object,
};

const enhance = compose(withRouter, inject('authStore', 'localeStore', 'templatesStore'), observer);

export default enhance(SignIn);
