import React from 'react';
import { Form, FormGroup, FormControl, InputPicker, ControlLabel, Row, Col, Button } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import validator from 'validator';
import PropTypes from 'prop-types';

const requestTypes = [
  {
    label: 'Customer support',
    value: 'Customer support',
  },
  {
    label: 'Business stuff',
    value: 'Business stuff',
  },
];

class FormForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        name: '',
        email: '',
        requestType: '',
        request: '',
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
    }
    if (!data.request) {
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
              requestType: '',
              request: '',
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
            <Col md={12}>
              <FormGroup controlId="name" className="inline">
                <ControlLabel>Full Name</ControlLabel>
                <FormControl name="name" />
              </FormGroup>
              <FormGroup controlId="email" className="inline">
                <ControlLabel>Email Address</ControlLabel>
                <FormControl name="email" />
              </FormGroup>
              <FormGroup controlId="requestType" className="inline">
                <ControlLabel>Request Type</ControlLabel>
                <FormControl
                  name="requestType"
                  placeholder="Please Select"
                  data={requestTypes}
                  accepter={InputPicker}
                />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup controlId="request" className="inline">
                <ControlLabel>What&apos;s Up</ControlLabel>
                <FormControl name="request" componentClass="textarea" />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
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

FormForm.propTypes = {
  formsStore: PropTypes.object.isRequired,
  notificationsStore: PropTypes.object.isRequired,
  uiStore: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

const enhance = compose(inject('formsStore', 'notificationsStore', 'uiStore'), observer);

export default enhance(FormForm);
