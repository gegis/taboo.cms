import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import classNames from 'classnames';
import { Row, Col, Grid } from 'rsuite';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

class FormPageBlock extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { formsStore, formId } = this.props;
    if (formId) {
      formsStore.loadById(formId);
    }
  }

  getForm() {
    const { formsStore, formId, form } = this.props;
    if (form) {
      return form;
    } else if (formsStore.formsMap[formId]) {
      return formsStore.formsMap[formId];
    }
    return {};
  }

  getFormTemplate(form) {
    const { formTemplates } = this.props.formsStore;
    if (form && form.template && formTemplates[form.template]) {
      return formTemplates[form.template].component;
    }
    return null;
  }

  onSubmit(data, options) {
    return new Promise(resolve => {
      const { formsStore, formId } = this.props;
      formsStore.submit(formId, data, options).then(data => {
        resolve(data);
      });
    });
  }

  render() {
    const form = this.getForm();
    const FormTemplate = this.getFormTemplate(form);
    if (FormTemplate) {
      return (
        <div className={classNames('form-page-block-wrapper', `form-${form.template}`)}>
          <Row className="">
            <Grid>
              <div className="form-page-block">
                <Row>
                  <Col>
                    <div className="form-header" dangerouslySetInnerHTML={{ __html: form.header }} />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormTemplate onSubmit={this.onSubmit} />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="form-footer" dangerouslySetInnerHTML={{ __html: form.footer }} />
                  </Col>
                </Row>
              </div>
            </Grid>
          </Row>
        </div>
      );
    }
    return null;
  }
}

FormPageBlock.propTypes = {
  formsStore: PropTypes.object.isRequired,
  formId: PropTypes.string.isRequired,
  form: PropTypes.object,
};

const enhance = compose(withRouter, inject('formsStore'), observer);

export default enhance(FormPageBlock);
