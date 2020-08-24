import React from 'react';
import { Form, FormGroup, FormControl, InputPicker, ControlLabel, Row, Col, Button } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import validator from 'validator';
import PropTypes from 'prop-types';

const { formTemplates: { contactUs: { requestTypes = [] } = {} } = {} } = window.app.config;

class ContactUsTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        name: '',
        email: '',
        phone: '',
        requestType: '',
        message: '',
      },
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onInputChange(formValues) {
    this.setState({ form: formValues });
  }

  validate(data = {}) {
    if (!data.name) {
      return 'Please enter your Full Name';
    }
    if (!data.email) {
      return 'Please enter your Email';
    }
    if (!validator.isEmail(data.email)) {
      return 'Email is not valid';
    }
    if (!data.requestType) {
      return 'Please select Request Type';
    } else if (data.requestType === 'Request a callback' && !data.phone) {
      return 'Please enter your Phone Number';
    }
    if (!data.message) {
      return 'Please enter your message';
    }

    return null;
  }

  onFormSubmit() {
    const { notificationsStore, uiStore, onSubmit } = this.props;
    const { form } = this.state;
    const data = Object.assign({}, form);
    const options = {
      params: {
        template: 'forms/contactUs',
      },
    };
    const errorMessage = this.validate(data);
    if (errorMessage) {
      notificationsStore.push({
        type: 'error',
        title: 'Invalid Form Data',
        html: errorMessage,
      });
    } else {
      uiStore.setLoading(true);
      onSubmit(data, options).then(result => {
        uiStore.setLoading(false);
        if (result && result.success) {
          notificationsStore.push({
            title: 'Success',
            html: 'We have successfully received your message',
          });
          this.setState({
            form: {
              name: '',
              email: '',
              phone: '',
              requestType: '',
              message: '',
            },
          });
        }
      });
    }
  }

  render() {
    const { form = {} } = this.state;
    return (
      <div className="contact-us-template">
        <Form fluid onChange={this.onInputChange} formValue={form}>
          <Row>
            <Col mdOffset={6} md={12}>
              <FormGroup controlId="name">
                <ControlLabel>Full Name</ControlLabel>
                <FormControl name="name" />
              </FormGroup>
              <FormGroup controlId="email">
                <ControlLabel>Email Address</ControlLabel>
                <FormControl name="email" />
              </FormGroup>
              <FormGroup controlId="phone">
                <ControlLabel>Phone Number</ControlLabel>
                <FormControl name="phone" />
              </FormGroup>
              <FormGroup controlId="requestType">
                <ControlLabel>Request Type</ControlLabel>
                <FormControl
                  name="requestType"
                  placeholder="Please Select..."
                  data={requestTypes}
                  accepter={InputPicker}
                />
              </FormGroup>
              <FormGroup controlId="message" className="inline">
                <ControlLabel>Message</ControlLabel>
                <FormControl name="message" componentClass="textarea" />
              </FormGroup>
            </Col>
            <Col mdOffset={6} md={12}>
              <Button appearance="primary" className="form-submit pull-right" onClick={this.onFormSubmit}>
                Submit
              </Button>
              <div className="clearfix" />
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

ContactUsTemplate.propTypes = {
  formsStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
  uiStore: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
};

const enhance = compose(inject('formsStore', 'notificationsStore', 'uiStore'), observer);

export default enhance(ContactUsTemplate);
