import React from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Checkbox, SelectPicker } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Translation from 'app/modules/core/client/components/Translation';
import NavigationItemsTree from 'modules/navigation/client/components/admin/NavigationItemsTree';

class NavigationForm extends React.Component {
  constructor(props) {
    super(props);
    this.navigationStore = props.navigationStore;
    this.localeStore = props.localeStore;
  }

  render() {
    const { setItem, item, setCheckboxItemValue } = this.navigationStore;
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
        <FormGroup controlId="slug" className="inline">
          <ControlLabel>
            <Translation message="Slug" />
          </ControlLabel>
          <FormControl name="slug" />
        </FormGroup>
        <FormGroup controlId="language" className="inline">
          <ControlLabel>
            <Translation message="Language" />
          </ControlLabel>
          <FormControl
            name="language"
            accepter={SelectPicker}
            data={this.localeStore.languageOptions}
            cleanable={false}
          />
        </FormGroup>
        <FormGroup controlId="enabled" className="inline">
          <ControlLabel>
            <Translation message="Enabled" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <Checkbox checked={item.enabled} onChange={setCheckboxItemValue.bind(null, 'enabled')} />
          </div>
        </FormGroup>
        <NavigationItemsTree />
      </Form>
    );
  }
}

NavigationForm.propTypes = {
  navigationStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('navigationStore', 'localeStore'), observer);

export default enhance(NavigationForm);
