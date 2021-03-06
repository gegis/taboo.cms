import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Form, FormGroup, FormControl, ControlLabel, Checkbox, Panel, PanelGroup } from 'rsuite';
import { inject, observer } from 'mobx-react';
import Translation from 'modules/core/ui/components/Translation';
import SettingsInput from 'modules/templates/ui/components/admin/SettingsInput';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.templatesAdminStore = props.templatesAdminStore;
    this.navigationAdminStore = props.navigationAdminStore;
  }

  componentDidMount() {
    this.navigationAdminStore.loadNavigationOptions();
  }

  render() {
    const { setItem, item, getFormData, setCheckboxItemValue } = this.templatesAdminStore;
    return (
      <div>
        <SettingsInput className="template-language-input-wrapper" type="TemplateLanguage" label="Template Language" />
        <PanelGroup accordion defaultActiveKey={1}>
          <Panel header="Template Info" eventKey={1}>
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
          <Panel header="Theme" eventKey={2}>
            <SettingsInput
              type="ColorPicker"
              label="Background Color"
              settingsKey="settings"
              settingsValueKey="backgroundColor"
            />
            <SettingsInput type="ColorPicker" label="Text Color" settingsKey="settings" settingsValueKey="textColor" />
            <SettingsInput
              type="ColorPicker"
              label="Primary Color"
              settingsKey="settings"
              settingsValueKey="primaryColor"
            />
            <SettingsInput
              type="ColorPicker"
              label="Primary Color Active"
              settingsKey="settings"
              settingsValueKey="primaryColorActive"
            />
            <SettingsInput
              type="ColorPicker"
              label="Button Text Color"
              settingsKey="settings"
              settingsValueKey="buttonTextColor"
            />
          </Panel>
          <Panel header="Header" eventKey={3}>
            <SettingsInput
              type="ImagePicker"
              label="Header Logo"
              settingsKey="settings"
              settingsValueKey="headerLogo"
            />
            <SettingsInput
              type="InputPicker"
              label="Header Navigation"
              settingsKey="languageSettings"
              settingsValueKey="headerNavigation"
              data={this.navigationAdminStore.navigationOptions}
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
              data={this.navigationAdminStore.navigationOptions}
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
          <Panel header="Footer" eventKey={4}>
            <SettingsInput
              type="InputPicker"
              label="Footer Navigation"
              settingsKey="languageSettings"
              settingsValueKey="footerNavigation"
              data={this.navigationAdminStore.navigationOptions}
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
              data={this.navigationAdminStore.navigationOptions}
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
        </PanelGroup>
      </div>
    );
  }
}

Settings.propTypes = {
  templatesAdminStore: PropTypes.object,
  navigationAdminStore: PropTypes.object,
};

const enhance = compose(inject('templatesAdminStore', 'navigationAdminStore'), observer);

export default enhance(Settings);
