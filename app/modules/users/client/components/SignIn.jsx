import React from 'react';
import { Redirect, withRouter, Link } from 'react-router-dom';
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
  Nav,
} from 'rsuite';
import Translation from 'app/modules/core/client/components/Translation';
import Layout from 'app/modules/core/client/components/Layout';
import NavLink from 'app/modules/core/client/components/NavLink';
import SocketsClient from 'app/modules/core/client/helpers/SocketsClient';

const { StringType } = Schema.Types;

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    const formValue = {
      email: '',
      password: '',
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
    const { authStore, localeStore, navigationStore, history } = this.props;
    const { email, password } = this.state.formValue;
    if (!this.form.current.check()) {
      Notification.error({
        title: 'Form Validation',
        description: localeStore.getTranslation('Please check all the fields'),
        duration: 5000,
      });
      return;
    }
    authStore.loginUser(email, password).then(data => {
      if (data) {
        authStore.loadUserAuth().then(user => {
          if (user) {
            navigationStore.loadNavigationByType('user');
            // In case if user had to sign in, we register event with his id
            SocketsClient.on(this.getUserEventName('update'), () => {
              authStore.loadUserAuth();
            });
            return history.push('/dashboard');
          } else {
            return history.push('/');
          }
        });
      }
    });
  }

  getUserEventName(action) {
    const { authStore } = this.props;
    let eventName = null;
    if (authStore.user && authStore.user.id) {
      eventName = `user-${authStore.user.id}-user-${action}`;
    }
    return eventName;
  }

  onFormChange(formValue) {
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
    const { authStore } = this.props;
    const { formValue, formError } = this.state;

    if (authStore && authStore.authenticated) {
      return <Redirect to="/dashboard" />;
    }

    return (
      <Layout className="sign-in-page" topRightMenu={this.getTopRightMenu()}>
        <Grid fluid>
          <Row>
            <Col xs={24} md={12} mdOffset={6}>
              <h1>
                <Translation message="Sign in" />
              </h1>
              <Panel className="login-panel" bordered>
                <Form
                  fluid
                  ref={this.form}
                  onChange={this.onFormChange}
                  onCheck={this.onFormCheck}
                  formValue={formValue}
                  formError={formError}
                  checkTrigger="blur"
                  model={this.model}
                  onSubmit={this.handleSubmit}
                >
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
                    <ButtonToolbar>
                      <Link className="form-action-link" to="/reset-password">
                        <Translation message="Forgot password?" />
                      </Link>
                      <Button className="pull-right" appearance="primary" onClick={this.handleSubmit}>
                        <Translation message="Sign in" />
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

SignIn.propTypes = {
  authStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
  navigationStore: PropTypes.object.isRequired,
  history: PropTypes.object,
};

const enhance = compose(withRouter, inject('authStore', 'localeStore', 'navigationStore'), observer);

export default enhance(SignIn);
