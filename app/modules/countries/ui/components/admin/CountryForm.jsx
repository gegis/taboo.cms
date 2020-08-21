import React from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Checkbox, Input, HelpBlock } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Translation from 'app/modules/core/ui/components/Translation';
import ImagePicker from 'modules/core/ui/components/ImagePicker';

class CountryForm extends React.Component {
  constructor(props) {
    super(props);
    this.countriesAdminStore = props.countriesAdminStore;
    this.onImageChange = this.onImageChange.bind(this);
  }

  onImageChange(url) {
    this.countriesAdminStore.setItem({ imageUrl: url });
  }

  render() {
    const { setItem, item, setCheckboxItemValue } = this.countriesAdminStore;
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
        <FormGroup controlId="iso" className="inline">
          <ControlLabel>
            <Translation message="ISO" />
          </ControlLabel>
          <FormControl name="iso" />
          <HelpBlock tooltip>It is recommended to keep it as ISO alpha-2 code</HelpBlock>
        </FormGroup>
        <FormGroup controlId="imageUrl" className="inline">
          <ControlLabel>
            <Translation message="Image" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <ImagePicker
              showPreview={true}
              input={<Input value={item.imageUrl} onChange={this.onImageChange} />}
              value={item.imageUrl}
              returnValueKey="url"
              onChange={this.onImageChange}
            />
          </div>
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

CountryForm.propTypes = {
  countriesAdminStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('countriesAdminStore'), observer);

export default enhance(CountryForm);
