import React from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Checkbox, InputPicker, Input, HelpBlock } from 'rsuite';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import Translation from 'app/modules/core/ui/components/Translation';
import PageBlocks from 'modules/pages/ui/components/admin/PageBlocks';
import ImagePicker from 'modules/core/ui/components/ImagePicker';

class PageForm extends React.Component {
  constructor(props) {
    super(props);
    this.pagesAdminStore = props.pagesAdminStore;
    this.localeStore = props.localeStore;
    this.templatesAdminStore = props.templatesAdminStore;
  }

  onImageChange(key, value) {
    const option = {};
    option[key] = value;
    this.pagesAdminStore.setItem(option);
  }

  render() {
    const { setItem, item, setCheckboxItemValue } = this.pagesAdminStore;
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
          <FormControl name="template" accepter={InputPicker} data={this.templatesAdminStore.templateOptions} />
        </FormGroup>
        <FormGroup controlId="language" className="inline">
          <ControlLabel>
            <Translation message="Language" />
          </ControlLabel>
          <FormControl name="language" accepter={InputPicker} data={this.localeStore.languageOptions} />
        </FormGroup>
        <FormGroup controlId="background" className="inline">
          <ControlLabel>
            <Translation message="Background Image" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <ImagePicker
              showPreview={true}
              input={<Input value={item.background} onChange={this.onImageChange.bind(this, 'background')} />}
              value={item.background}
              returnValueKey="url"
              onChange={this.onImageChange.bind(this, 'background')}
              onClear={this.onImageChange.bind(this, 'background', '')}
            />
          </div>
          <HelpBlock tooltip>Recommended size: 1600 x 500 px </HelpBlock>
        </FormGroup>
        <FormGroup controlId="headerBackground" className="inline">
          <ControlLabel>
            <Translation message="Header Background Image" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <ImagePicker
              showPreview={true}
              input={
                <Input value={item.headerBackground} onChange={this.onImageChange.bind(this, 'headerBackground')} />
              }
              value={item.headerBackground}
              returnValueKey="url"
              onChange={this.onImageChange.bind(this, 'headerBackground')}
              onClear={this.onImageChange.bind(this, 'headerBackground', '')}
            />
          </div>
          <HelpBlock tooltip>Recommended size: 1600 x 500 px </HelpBlock>
        </FormGroup>
        <FormGroup controlId="fullWidth" className="inline">
          <ControlLabel>
            <Translation message="Full Width" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <Checkbox id="fullWidth" checked={item.fullWidth} onChange={setCheckboxItemValue.bind(null, 'fullWidth')} />
          </div>
        </FormGroup>
        <FormGroup controlId="published" className="inline">
          <ControlLabel>
            <Translation message="Published" />
          </ControlLabel>
          <div className="rs-form-control-wrapper">
            <Checkbox id="published" checked={item.published} onChange={setCheckboxItemValue.bind(null, 'published')} />
          </div>
        </FormGroup>
        <div className="panel-wrapper blocks">
          <div className="header">
            <h6>
              <Translation message="Body" />
            </h6>
          </div>
          <PageBlocks />
        </div>
        <div className="panel-wrapper meta">
          <div className="header">
            <h6>
              <Translation message="Meta Information" />
            </h6>
          </div>
          <div className="body">
            <FormGroup controlId="metaTitle" className="inline">
              <ControlLabel>
                <Translation message="Meta Title" />
              </ControlLabel>
              <FormControl name="metaTitle" />
            </FormGroup>
            <FormGroup controlId="metaKeywords" className="inline">
              <ControlLabel>
                <Translation message="Meta Keywords" />
              </ControlLabel>
              <FormControl name="metaKeywords" />
            </FormGroup>
            <FormGroup controlId="metaDescription">
              <ControlLabel>
                <Translation message="Meta Description" />
              </ControlLabel>
              <FormControl name="metaDescription" componentClass="textarea" rows={2} />
            </FormGroup>
          </div>
        </div>
      </Form>
    );
  }
}

PageForm.propTypes = {
  pagesAdminStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
  templatesAdminStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('pagesAdminStore', 'localeStore', 'templatesAdminStore'), observer);

export default enhance(PageForm);
