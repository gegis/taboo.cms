import React from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Checkbox } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Translation from 'app/modules/core/ui/components/Translation';
import UnitsHelper from 'app/modules/core/ui/helpers/UnitsHelper';

class UploadForm extends React.Component {
  constructor(props) {
    super(props);
    this.uploadsStore = props.uploadsStore;
  }

  render() {
    const { item, setItem, setCheckboxItemValue } = this.uploadsStore;
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
        <FormGroup controlId="url" className="inline">
          <ControlLabel>
            <Translation message="URL" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <div className="rs-form-data-value">
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.url}
              </a>
            </div>
          </div>
        </FormGroup>
        <FormGroup controlId="path" className="inline">
          <ControlLabel>
            <Translation message="Path" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <div className="rs-form-data-value">{item.path}</div>
          </div>
        </FormGroup>
        <FormGroup controlId="size" className="inline">
          <ControlLabel>
            <Translation message="Size" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <div className="rs-form-data-value">{UnitsHelper.parseSizeAuto(item.size)}</div>
          </div>
        </FormGroup>
        <FormGroup controlId="type" className="inline">
          <ControlLabel>
            <Translation message="Type" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <div className="rs-form-data-value">{item.type}</div>
          </div>
        </FormGroup>
        <FormGroup controlId="createdAt" className="inline">
          <ControlLabel>
            <Translation message="Created At" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <div className="rs-form-data-value">{item.createdAt}</div>
          </div>
        </FormGroup>
        <FormGroup controlId="isUserDocument" className="inline">
          <ControlLabel>
            <Translation message="Is User Document" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <Checkbox
              checked={item.isUserDocument}
              onChange={setCheckboxItemValue.bind(null, 'isUserDocument')}
              disabled
            />
          </div>
        </FormGroup>
        {/*TODO find out why it shows as not user document when it is*/}
        <FormGroup controlId="verified" className="inline">
          <ControlLabel>
            <Translation message="Verified" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <Checkbox checked={item.verified} onChange={setCheckboxItemValue.bind(null, 'verified')} />
          </div>
        </FormGroup>
        <FormGroup controlId="documentType" className="inline">
          <ControlLabel>
            <Translation message="Document Type" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <div className="rs-form-data-value">{item.documentType}</div>
          </div>
        </FormGroup>
        <FormGroup controlId="note">
          <ControlLabel>
            <Translation message="Note" />
          </ControlLabel>
          <FormControl name="note" />
        </FormGroup>
      </Form>
    );
  }
}

UploadForm.propTypes = {
  uploadsStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('uploadsStore'), observer);

export default enhance(UploadForm);
