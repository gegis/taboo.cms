import React from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Checkbox } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Translation from 'app/modules/core/ui/components/Translation';

class NavigationItemForm extends React.Component {
  constructor(props) {
    super(props);
    this.navigationStore = props.navigationStore;
  }

  render() {
    const { setNavigationItem, navigationItem, setCheckboxNavigationItemValue } = this.navigationStore;
    return (
      <Form layout="horizontal" fluid onChange={setNavigationItem} formValue={navigationItem}>
        {navigationItem.id && (
          <FormGroup controlId="id" className="inline">
            <ControlLabel>
              <Translation message="ID" />
            </ControlLabel>
            <FormControl name="id" disabled />
          </FormGroup>
        )}
        {navigationItem.id && <div className="clearfix" />}
        <FormGroup controlId="title" className="inline">
          <ControlLabel>
            <Translation message="Title" />
          </ControlLabel>
          <FormControl name="title" />
        </FormGroup>
        <FormGroup controlId="url" className="inline">
          <ControlLabel>
            <Translation message="URL" />
          </ControlLabel>
          <FormControl name="url" />
        </FormGroup>
        <FormGroup controlId="openInNewPage" className="inline">
          <ControlLabel>
            <Translation message="Open In New Page" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <Checkbox
              checked={navigationItem.openInNewPage}
              onChange={setCheckboxNavigationItemValue.bind(null, 'openInNewPage')}
            />
          </div>
        </FormGroup>
        <FormGroup controlId="enabled" className="inline">
          <ControlLabel>
            <Translation message="Enabled" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <Checkbox
              checked={navigationItem.enabled}
              onChange={setCheckboxNavigationItemValue.bind(null, 'enabled')}
            />
          </div>
        </FormGroup>
      </Form>
    );
  }
}

NavigationItemForm.propTypes = {
  navigationStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('navigationStore'), observer);

export default enhance(NavigationItemForm);
