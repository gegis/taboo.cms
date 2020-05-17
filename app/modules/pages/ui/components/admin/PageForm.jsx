import React from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Checkbox, InputPicker } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Translation from 'app/modules/core/ui/components/Translation';
import PageBlocks from 'modules/pages/ui/components/admin/PageBlocks';

class PageForm extends React.Component {
  constructor(props) {
    super(props);
    this.pagesStore = props.pagesStore;
    this.localeStore = props.localeStore;
    this.templatesStore = props.templatesStore;
  }

  render() {
    const { setItem, item, setCheckboxItemValue } = this.pagesStore;
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
        <FormGroup controlId="url" className="inline">
          <ControlLabel>
            <Translation message="URL" />
          </ControlLabel>
          <FormControl name="url" />
        </FormGroup>
        <FormGroup controlId="template" className="inline">
          <ControlLabel>
            <Translation message="Template" />
          </ControlLabel>
          <FormControl name="template" accepter={InputPicker} data={this.templatesStore.templateOptions} />
        </FormGroup>
        <FormGroup controlId="language" className="inline">
          <ControlLabel>
            <Translation message="Language" />
          </ControlLabel>
          <FormControl name="language" accepter={InputPicker} data={this.localeStore.languageOptions} />
        </FormGroup>
        <FormGroup controlId="published" className="inline">
          <ControlLabel>
            <Translation message="Published" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <Checkbox id="published" checked={item.published} onChange={setCheckboxItemValue.bind(null, 'published')} />
          </div>
        </FormGroup>
        <FormGroup controlId="blocks">
          <ControlLabel>
            <Translation message="Body" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <PageBlocks />
          </div>
        </FormGroup>
      </Form>
    );
  }
}

PageForm.propTypes = {
  pagesStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
  templatesStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('pagesStore', 'localeStore', 'templatesStore'), observer);

export default enhance(PageForm);
