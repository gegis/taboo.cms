import React from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Checkbox } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Translation from 'app/modules/core/ui/components/Translation';

class TemplateForm extends React.Component {
  constructor(props) {
    super(props);
    this.templatesAdminStore = props.templatesAdminStore;
  }

  render() {
    const { setItem, item, setCheckboxItemValue } = this.templatesAdminStore;
    return (
      <Form layout="horizontal" fluid onChange={setItem} formValue={item}>
        {item.id && (
          <FormGroup controlId="id" className="inline">
            <ControlLabel>
              <Translation message="ID" />
            </ControlLabel>
            <FormControl name="id" disabled />
          </FormGroup>
        )}
        {item.id && <div className="clearfix" />}
        <FormGroup controlId="name" className="inline">
          <ControlLabel>
            <Translation message="Name" />
          </ControlLabel>
          <FormControl name="name" />
        </FormGroup>
        <FormGroup controlId="title" className="inline">
          <ControlLabel>
            <Translation message="Title" />
          </ControlLabel>
          <FormControl name="title" />
        </FormGroup>
        <FormGroup controlId="description" className="inline">
          <ControlLabel>
            <Translation message="Description" />
          </ControlLabel>
          <FormControl name="description" />
        </FormGroup>
        <FormGroup controlId="default" className="inline">
          <ControlLabel>
            <Translation message="Default" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <Checkbox checked={item.enabled} onChange={setCheckboxItemValue.bind(null, 'default')} />
          </div>
        </FormGroup>
      </Form>
    );
  }
}

TemplateForm.propTypes = {
  templatesAdminStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('templatesAdminStore'), observer);

export default enhance(TemplateForm);
