import React from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Checkbox } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Translation from 'app/modules/core/ui/components/Translation';
import GalleryImages from './GalleryImages';

class GalleryForm extends React.Component {
  constructor(props) {
    super(props);
    this.galleriesAdminStore = props.galleriesAdminStore;
  }

  render() {
    const { setItem, item, setCheckboxItemValue } = this.galleriesAdminStore;
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
        <FormGroup controlId="title" className="inline">
          <ControlLabel>
            <Translation message="Title" />
          </ControlLabel>
          <FormControl name="title" />
        </FormGroup>
        <FormGroup controlId="published" className="inline">
          <ControlLabel>
            <Translation message="Published" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <Checkbox checked={item.published} onChange={setCheckboxItemValue.bind(null, 'published')} />
          </div>
        </FormGroup>
        <GalleryImages />
      </Form>
    );
  }
}

GalleryForm.propTypes = {
  galleriesAdminStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('galleriesAdminStore'), observer);

export default enhance(GalleryForm);
