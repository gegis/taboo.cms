import React from 'react';
import { Redirect, withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import axios from 'axios';
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
} from 'rsuite';
import Translation from 'app/modules/core/client/components/Translation';
import Layout from 'app/themes/admin/client/components/Layout';
import ResponseHelper from 'app/modules/core/client/helpers/ResponseHelper';

const { StringType } = Schema.Types;

class Login extends React.Component {
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
    const { authStore, localeStore, history } = this.props;
    if (!this.form.current.check()) {
      Notification.error({
        title: 'Form Validation',
        description: localeStore.getTranslation('Please check all the fields'),
        duration: 5000,
      });
      return;
    }
    axios
      .post('/api/login', {
        email: this.state.formValue.email,
        password: this.state.formValue.password,
      })
      .then(response => {
        if (response && response.data) {
          authStore.loadUserAuth().then(user => {
            if (user && user.admin) {
              return history.push('/admin');
            }
            window.location = '/';
          });
        }
      })
      .catch(ResponseHelper.handleError);
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

  render() {
    const { authStore } = this.props;
    const { formValue, formError } = this.state;

    if (authStore && authStore.authenticated) {
      if (authStore.admin) {
        return <Redirect to="/admin" />;
      } else {
        return (window.location = '/');
      }
    }

    return (
      <Layout className="login-page" sidebar={false}>
        <Grid fluid>
          <Row>
            <Col xs={24} sm={12} smOffset={6} lg={8} lgOffset={8}>
              <Panel
                className="login-panel shadow"
                header={
                  <h3>
                    <Translation message="Login" />
                  </h3>
                }
                bordered
              >
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
                      <Translation message="Email address" />
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
                      <Button appearance="primary" onClick={this.handleSubmit}>
                        <Translation message="Login" />
                      </Button>
                      <Link to="/admin/reset-password">Forgot password?</Link>
                    </ButtonToolbar>
                  </FormGroup>
                </Form>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </Layout>
    );
  }
}

Login.propTypes = {
  authStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
  history: PropTypes.object,
};

const enhance = compose(withRouter, inject('authStore', 'localeStore'), observer);

export default enhance(Login);
