import React from 'react';
import { Form, FormGroup, FormControl, ControlLabel } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Translation from 'app/modules/core/client/components/Translation';

class ModelNameForm extends React.Component {
  constructor(props) {
    super(props);
    this.moduleNameStore = props.moduleNameStore;
  }

  render() {
    const { setItem, item } = this.moduleNameStore;
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
        <FormGroup controlId="todo" className="inline">
          <ControlLabel>
            <Translation message="Todo" />
          </ControlLabel>
          <FormControl name="todo" />
        </FormGroup>
      </Form>
    );
  }
}

ModelNameForm.propTypes = {
  moduleNameStore: PropTypes.object.isRequired,
};

const enhance = compose(
  inject('moduleNameStore'),
  observer
);

export default enhance(ModelNameForm);
