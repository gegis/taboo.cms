import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import {
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Checkbox,
  Panel,
  PanelGroup,
  SelectPicker,
  InputPicker,
} from 'rsuite';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import Translation from 'modules/core/client/components/Translation';

class Template extends React.Component {
  constructor(props) {
    super(props);
    this.localeStore = props.localeStore;
    this.templatesStore = props.templatesStore;
    this.onLanguageChange = this.onLanguageChange.bind(this);
  }

  onLanguageChange(value) {
    this.templatesStore.setLanguage(value, true);
  }

  render() {
    const {
      setItem,
      item,
      getFormData,
      setCheckboxItemValue,
      setItemSettings,
      getItemSettingsData,
      language,
    } = this.templatesStore;
    const { languageOptions } = this.localeStore;
    return (
      <div>
        {languageOptions && languageOptions.length > 1 && (
          <div className="language-selector">
            <InputPicker
              value={language}
              onChange={this.onLanguageChange}
              data={languageOptions}
              cleanable={false}
              style={{ width: '100%' }}
            />
          </div>
        )}
        <PanelGroup accordion>
          <Panel header="Template Info">
            <Form layout="vertical" fluid onChange={setItem} formValue={getFormData()}>
              <FormGroup controlId="name">
                <ControlLabel>
                  <Translation message="Name" />
                </ControlLabel>
                <FormControl name="name" disabled />
              </FormGroup>
              <FormGroup controlId="title">
                <ControlLabel>
                  <Translation message="Title" />
                </ControlLabel>
                <FormControl name="title" />
              </FormGroup>
              <FormGroup controlId="description">
                <ControlLabel>
                  <Translation message="Description" />
                </ControlLabel>
                <FormControl name="description" />
              </FormGroup>
              <FormGroup controlId="default">
                <ControlLabel>
                  <Translation message="Default" />
                </ControlLabel>
                <div className="rs-form-control-wrapper">
                  <Checkbox checked={item.default} onChange={setCheckboxItemValue.bind(null, 'default')} />
                </div>
              </FormGroup>
            </Form>
          </Panel>
          <Panel header="Header">
            <Form layout="vertical" fluid onChange={setItemSettings} formValue={getItemSettingsData()}>
              <FormGroup controlId="header-navigation">
                <ControlLabel>
                  <Translation message="Header Navigation" />
                </ControlLabel>
                <FormControl name="headerNavigation" accepter={SelectPicker} data={this.localeStore.languageOptions} />
              </FormGroup>
            </Form>
          </Panel>
          <Panel header="Footer">TODO</Panel>
          <Panel header="Theme">TODO</Panel>
        </PanelGroup>
      </div>
    );
  }
}

Template.propTypes = {
  templatesStore: PropTypes.object,
  localeStore: PropTypes.object,
};

const enhance = compose(withRouter, inject('templatesStore', 'localeStore'), observer);

export default enhance(Template);
