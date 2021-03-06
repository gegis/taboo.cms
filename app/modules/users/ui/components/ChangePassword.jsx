import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import axios from 'axios';
import { Form, FormGroup, ControlLabel, FormControl, Button, Grid, Row, Col, Schema, Notification } from 'rsuite';
import Translation from 'app/modules/core/ui/components/Translation';
import ResponseHelper from 'app/modules/core/ui/helpers/ResponseHelper';
import TemplatesHelper from 'modules/templates/ui/helpers/TemplatesHelper';
import UsersHelper from 'modules/users/ui/helpers/UsersHelper';

const { StringType } = Schema.Types;

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    const { match: { params = {} } = {} } = props;
    const formValue = {
      newPass: '',
      newPassRepeat: '',
    };
    const { schema: { newPassword = null } = {} } = UsersHelper.getUserFormValidation();
    this.state = {
      userId: params.userId,
      token: params.token,
      formValue: formValue,
      formError: {},
    };
    this.model = Schema.Model({
      newPass: StringType().isRequired('New Password is required.'),
      newPassRepeat: StringType()
        .isRequired('Repeat Password is required.')
        .addRule((value, data) => {
          return data.newPass === value;
        }, "Passwords don't match"),
    });
    if (newPassword) {
      // this.model.schema.newPass = newPassword;
    }
    this.form = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onFormChange = this.onFormChange.bind(this);
    this.onFormCheck = this.onFormCheck.bind(this);
    this.onInputKeyDown = this.onInputKeyDown.bind(this);
  }

  handleSubmit() {
    const { localeStore, history } = this.props;
    if (!this.form.current.check()) {
      Notification.error({
        title: 'Form Validation',
        description: localeStore.getTranslation('Please check form fields'),
        duration: 5000,
      });
      return;
    }
    axios
      .post('/api/change-password', {
        userId: this.state.userId,
        token: this.state.token,
        newPass: this.state.formValue.newPass,
        newPassRepeat: this.state.formValue.newPassRepeat,
      })
      .then(response => {
        if (response && response.data) {
          if (response.data.success) {
            Notification.info({
              title: 'Password Change',
              description: localeStore.getTranslation('Password has been successfully updated.'),
              duration: 15000,
            });
            return history.push('/sign-in');
          } else {
            Notification.error({
              title: 'Password Change',
              description: localeStore.getTranslation('Password change request has failed.'),
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
    const { authStore, templatesStore } = this.props;
    const { formValue, formError } = this.state;
    const Template = TemplatesHelper.getDefaultTemplate({ templatesStore });
    if (authStore && authStore.authenticated) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <Template
        className="change-password-page"
        title="Password Change"
        metaTitle="Password Change"
        headerMinimized={true}
      >
        <Grid fluid>
          <Row>
            <Col xs={24} sm={16} lg={12} smOffset={4} lgOffset={6}>
              <Form
                fluid
                ref={this.form}
                onChange={this.onFormChange}
                onCheck={this.onFormCheck}
                formValue={formValue}
                formError={formError}
                checkTrigger="change"
                model={this.model}
                onSubmit={this.handleSubmit}
                className="form"
              >
                <FormGroup>
                  <ControlLabel>
                    <Translation message="New Password" />
                  </ControlLabel>
                  <FormControl
                    name="newPass"
                    type="password"
                    onKeyDown={this.onInputKeyDown}
                    autoComplete="new-password"
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>
                    <Translation message="Repeat Password" />
                  </ControlLabel>
                  <FormControl
                    name="newPassRepeat"
                    type="password"
                    onKeyDown={this.onInputKeyDown}
                    autoComplete="new-password"
                  />
                </FormGroup>
                <FormGroup className="form-submit-wrapper">
                  <Button appearance="primary" onClick={this.handleSubmit}>
                    <Translation message="Change" />
                  </Button>
                </FormGroup>
                <FormGroup className="form-footer-links">
                  <Link className="form-action-link" to="/sign-in">
                    Login
                  </Link>
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </Grid>
      </Template>
    );
  }
}

ChangePassword.propTypes = {
  authStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
  templatesStore: PropTypes.object.isRequired,
  history: PropTypes.object,
  match: PropTypes.object,
};

const enhance = compose(withRouter, inject('authStore', 'localeStore', 'templatesStore'), observer);

export default enhance(ChangePassword);
