import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
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
import ResponseHelper from 'app/modules/core/client/helpers/ResponseHelper';

const { StringType } = Schema.Types;

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    const formValue = {
      email: '',
    };
    this.state = {
      formValue: formValue,
      formError: {},
    };
    this.model = Schema.Model({
      email: StringType()
        .isEmail('Please enter a valid email address.')
        .isRequired('Email address is required.'),
    });
    this.form = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onFormChange = this.onFormChange.bind(this);
    this.onFormCheck = this.onFormCheck.bind(this);
    this.onInputKeyDown = this.onInputKeyDown.bind(this);
  }

  handleSubmit() {
    const { localeStore, history, uiStore } = this.props;
    if (!this.form.current.check()) {
      Notification.error({
        title: 'Form Validation',
        description: localeStore.getTranslation('Please check your email address'),
        duration: 5000,
      });
      return;
    }
    uiStore.setLoading(true);
    axios
      .post('/api/reset-password', {
        email: this.state.formValue.email,
      })
      .then(response => {
        uiStore.setLoading(false);
        if (response && response.data) {
          if (response.data.success) {
            Notification.info({
              title: 'Password Reset',
              description: localeStore.getTranslation(
                'Password reset information has been successfully sent to your email address.'
              ),
              duration: 15000,
            });
            return history.push('/sign-in');
          } else {
            Notification.error({
              title: 'Password Reset',
              description: localeStore.getTranslation('Password reset request has failed.'),
              duration: 15000,
            });
          }
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
    const { authStore, templatesStore: { templateComponents = {}, defaultTemplateName = '' } = {} } = this.props;
    const { formValue, formError } = this.state;
    const Template = templateComponents[defaultTemplateName];
    if (authStore && authStore.authenticated) {
      if (authStore.admin) {
        return <Redirect to="/admin" />;
      } else {
        return (window.location = '/');
      }
    }

    return (
      <Template className="reset-password-page">
        <Grid fluid>
          <Row>
            <Col xs={24} md={12} mdOffset={6}>
              <h1>
                <Translation message="Forgot password?" />
              </h1>
              <Panel className="reset-pass-panel" bordered>
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
                    <ButtonToolbar>
                      <Link className="form-action-link" to="/sign-in">
                        <Translation message="Sign in" />
                      </Link>
                      <Button className="pull-right" appearance="primary" onClick={this.handleSubmit}>
                        <Translation message="Reset" />
                      </Button>
                    </ButtonToolbar>
                  </FormGroup>
                  <div className="clearfix" />
                </Form>
              </Panel>
              <p className="color-passive">
                <Translation message="Enter your email and we will send you a link to reset your password" />
              </p>
            </Col>
          </Row>
        </Grid>
      </Template>
    );
  }
}

ResetPassword.propTypes = {
  authStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
  uiStore: PropTypes.object.isRequired,
  templatesStore: PropTypes.object.isRequired,
  history: PropTypes.object,
};

const enhance = compose(withRouter, inject('authStore', 'localeStore', 'uiStore', 'templatesStore'), observer);

export default enhance(ResetPassword);
