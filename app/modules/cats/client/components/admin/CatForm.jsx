import React from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Checkbox } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Translation from 'app/modules/core/client/components/Translation';

class CatForm extends React.Component {
  constructor(props) {
    super(props);
    this.catsStore = props.catsStore;
  }

  render() {
    const { setItem, item, setCheckboxItemValue } = this.catsStore;
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
        <FormGroup controlId="enabled" className="inline">
          <ControlLabel>
            <Translation message="Enabled" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <Checkbox checked={item.enabled} onChange={setCheckboxItemValue.bind(null, 'enabled')} />
          </div>
        </FormGroup>
      </Form>
    );
  }
}

CatForm.propTypes = {
  catsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('catsStore'), observer);

export default enhance(CatForm);
