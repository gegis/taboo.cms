import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Form, FormGroup, FormControl, ControlLabel, Checkbox, Panel, PanelGroup } from 'rsuite';
import { inject, observer } from 'mobx-react';
import Translation from 'modules/core/client/components/Translation';
import SettingsInput from 'modules/templates/client/components/admin/SettingsInput';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.templatesStore = props.templatesStore;
    this.navigationStore = props.navigationStore;
  }

  componentDidMount() {
    this.navigationStore.loadNavigationOptions();
  }

  render() {
    const { setItem, item, getFormData, setCheckboxItemValue } = this.templatesStore;
    return (
      <div>
        <SettingsInput className="template-language-input-wrapper" type="TemplateLanguage" label="Template Language" />
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
            <SettingsInput type="Input" label="Header Logo" settingsKey="settings" settingsValueKey="headerLogo" />
            <SettingsInput
              type="InputPicker"
              label="Header Navigation"
              settingsKey="languageSettings"
              settingsValueKey="headerNavigation"
              data={this.navigationStore.navigationOptions}
            />
            <SettingsInput
              type="InputPicker"
              label={
                <span>
                  <Translation message="Header Navigation" /> (<Translation message="Authenticated" />)
                </span>
              }
              settingsKey="languageSettings"
              settingsValueKey="headerNavigationAuthenticated"
              data={this.navigationStore.navigationOptions}
            />
            <SettingsInput
              type="ColorPicker"
              label="Header Color"
              settingsKey="settings"
              settingsValueKey="headerColor"
            />
            <SettingsInput
              type="ColorPicker"
              label="Header Text Color"
              settingsKey="settings"
              settingsValueKey="headerTextColor"
            />
          </Panel>
          <Panel header="Footer">
            <SettingsInput
              type="InputPicker"
              label="Footer Navigation"
              settingsKey="languageSettings"
              settingsValueKey="footerNavigation"
              data={this.navigationStore.navigationOptions}
            />
            <SettingsInput
              type="InputPicker"
              label={
                <span>
                  <Translation message="Footer Navigation" /> (<Translation message="Authenticated" />)
                </span>
              }
              settingsKey="languageSettings"
              settingsValueKey="footerNavigationAuthenticated"
              data={this.navigationStore.navigationOptions}
            />
            <SettingsInput
              type="ColorPicker"
              label="Footer Color"
              settingsKey="settings"
              settingsValueKey="footerColor"
            />
            <SettingsInput
              type="ColorPicker"
              label="Footer Text Color"
              settingsKey="settings"
              settingsValueKey="footerTextColor"
            />
            <SettingsInput
              type="TextArea"
              label="Footer Copyright"
              settingsKey="languageSettings"
              settingsValueKey="footerCopyright"
            />
          </Panel>
          <Panel header="Theme">
            <SettingsInput
              type="ColorPicker"
              label="Background Color"
              settingsKey="settings"
              settingsValueKey="backgroundColor"
            />
            <SettingsInput type="ColorPicker" label="Text Color" settingsKey="settings" settingsValueKey="textColor" />
          </Panel>
        </PanelGroup>
      </div>
    );
  }
}

Settings.propTypes = {
  templatesStore: PropTypes.object,
  navigationStore: PropTypes.object,
};

const enhance = compose(inject('templatesStore', 'navigationStore'), observer);

export default enhance(Settings);
