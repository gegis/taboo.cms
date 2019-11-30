import React from 'react';
import { Form, FormGroup, FormControl, ControlLabel, CheckboxGroup, Checkbox } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Translation from 'app/modules/core/client/components/Translation';

class RoleForm extends React.Component {
  constructor(props) {
    super(props);
    this.aclStore = props.aclStore;
    this.rolesStore = props.rolesStore;
  }

  render() {
    const { item, setItem } = this.rolesStore;
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
        <FormGroup controlId="resources">
          <ControlLabel>
            <Translation message="Resources" />
          </ControlLabel>
          <FormControl name="resources" accepter={CheckboxGroup}>
            {this.aclStore.allResources.map(resource => (
              <Checkbox value={resource} key={resource}>
                {resource}
              </Checkbox>
            ))}
          </FormControl>
        </FormGroup>
      </Form>
    );
  }
}

RoleForm.propTypes = {
  rolesStore: PropTypes.object.isRequired,
  aclStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('aclStore', 'rolesStore'), observer);

export default enhance(RoleForm);
