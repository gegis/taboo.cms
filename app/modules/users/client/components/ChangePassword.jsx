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
import Layout from 'app/modules/core/client/components/Layout';
import ResponseHelper from 'app/modules/core/client/helpers/ResponseHelper';

const { StringType } = Schema.Types;

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    const { match: { params = {} } = {} } = props;
    const formValue = {
      newPass: '',
      newPassRepeat: '',
    };
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
    const { authStore } = this.props;
    const { formValue, formError } = this.state;
    if (authStore && authStore.authenticated) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <Layout className="change-password-page">
        <Grid fluid>
          <Row>
            <Col xs={24} sm={16} lg={12} smOffset={4} lgOffset={6}>
              <h1>
                <Translation message="Password Change" />
              </h1>
              <Panel className="change-password-panel" bordered>
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
                      <Translation message="New Password" />
                    </ControlLabel>
                    <FormControl name="newPass" type="password" onKeyDown={this.onInputKeyDown} />
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel>
                      <Translation message="Repeat Password" />
                    </ControlLabel>
                    <FormControl name="newPassRepeat" type="password" onKeyDown={this.onInputKeyDown} />
                  </FormGroup>
                  <FormGroup>
                    <ButtonToolbar>
                      <Link className="form-action-link" to="/sign-in">
                        <Translation message="Sign in" />
                      </Link>
                      <Button className="pull-right" appearance="primary" onClick={this.handleSubmit}>
                        <Translation message="Change" />
                      </Button>
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

ChangePassword.propTypes = {
  authStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
  history: PropTypes.object,
  match: PropTypes.object,
};

const enhance = compose(
  withRouter,
  inject('authStore', 'localeStore'),
  observer
);

export default enhance(ChangePassword);
