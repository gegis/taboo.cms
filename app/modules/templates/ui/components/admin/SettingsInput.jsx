import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import { InputGroup, Input, InputPicker } from 'rsuite';
import PropTypes from 'prop-types';

import Translation from 'modules/core/ui/components/Translation';
import TemplatesHelper from 'modules/templates/ui/helpers/TemplatesHelper';
import ColorPicker from 'modules/core/ui/components/ColorPicker';
import ImagePicker from 'modules/core/ui/components/ImagePicker';

class SettingsInput extends React.Component {
  constructor(props) {
    super(props);
    this.templatesAdminStore = props.templatesAdminStore;
    this.localeStore = props.localeStore;
    this.onSettingsChange = this.onSettingsChange.bind(this);
    this.onLanguageSettingsChange = this.onLanguageSettingsChange.bind(this);
    this.onLanguageChange = this.onLanguageChange.bind(this);
  }

  onSettingsChange(key, value) {
    const { onChange = null, authStore, templatesAdminStore } = this.props;
    this.templatesAdminStore.onSettingsChange(key, value);
    TemplatesHelper.emitTemplateChanges({ authStore, templatesAdminStore });
    if (onChange && typeof onChange === 'function') {
      onChange(key, value, 'settings');
    }
  }

  onLanguageSettingsChange(key, value) {
    const { onChange = null, authStore, templatesAdminStore } = this.props;
    this.templatesAdminStore.onLanguageSettingsChange(key, value);
    TemplatesHelper.emitTemplateChanges({ authStore, templatesAdminStore });
    if (onChange && typeof onChange === 'function') {
      onChange(key, value, 'languageSettings');
    }
  }

  onLanguageChange(value) {
    this.templatesAdminStore.setLanguage(value, true);
  }

  getColorPicker({ settingsItem, settingsValueKey, settingsOnChange, settingsOnClear }) {
    return (
      <ColorPicker
        input={<Input value={settingsItem[settingsValueKey]} onChange={settingsOnChange} />}
        value={settingsItem[settingsValueKey]}
        returnValueKey="hex"
        onChange={settingsOnChange}
        onClear={settingsOnClear}
      />
    );
  }

  getImagePicker({ settingsItem, settingsValueKey, settingsOnChange, settingsOnClear }) {
    return (
      <ImagePicker
        input={<Input value={settingsItem[settingsValueKey]} onChange={settingsOnChange} />}
        value={settingsItem[settingsValueKey]}
        returnValueKey="url"
        onChange={settingsOnChange}
        onClear={settingsOnClear}
      />
    );
  }

  getInputByType() {
    const { type, settingsKey, settingsValueKey, data } = this.props;
    const { languageOptions } = this.localeStore;
    let input = null;
    let settingsItem = null;
    let settingsOnChange = null;
    let settingsOnClear = null;

    switch (settingsKey) {
      case 'settings':
        settingsItem = this.templatesAdminStore.settings;
        settingsOnChange = this.onSettingsChange;
        settingsOnClear = this.onSettingsChange;
        break;
      case 'languageSettings':
        settingsItem = this.templatesAdminStore.languageSettings;
        settingsOnChange = this.onLanguageSettingsChange;
        break;
    }

    if (settingsOnChange !== null && typeof settingsOnChange === 'function') {
      settingsOnChange = settingsOnChange.bind(this.templatesAdminStore, settingsValueKey);
    }

    if (settingsOnClear !== null && typeof settingsOnClear === 'function') {
      settingsOnClear = settingsOnClear.bind(this.templatesAdminStore, settingsValueKey, '');
    }

    switch (type) {
      case 'Input':
        input = <Input value={settingsItem[settingsValueKey]} onChange={settingsOnChange} />;
        break;
      case 'InputPicker':
        input = <InputPicker value={settingsItem[settingsValueKey]} data={data} onChange={settingsOnChange} />;
        break;
      case 'TextArea':
        input = (
          <Input
            componentClass="textarea"
            value={settingsItem[settingsValueKey]}
            data={data}
            onChange={settingsOnChange}
            style={{ width: '100%', minWidth: 'auto' }}
          />
        );
        break;
      case 'TemplateLanguage':
        input = (
          <InputPicker
            className="template-language-input"
            value={this.templatesAdminStore.language}
            onChange={this.onLanguageChange}
            data={languageOptions}
            cleanable={false}
          />
        );
        break;
      case 'ImagePicker':
        input = this.getImagePicker({ settingsItem, settingsValueKey, settingsOnChange, settingsOnClear });
        break;
      case 'ColorPicker':
        input = this.getColorPicker({ settingsItem, settingsValueKey, settingsOnChange, settingsOnClear });
        break;
    }

    return input;
  }

  render() {
    const { label, className } = this.props;

    return (
      <InputGroup classPrefix="input-group-wrapper" className={className}>
        {label && (
          <label>
            {typeof label === 'string' && <Translation message={label} />}
            {typeof label === 'object' && <span>{label}</span>}
          </label>
        )}
        <div className="input-wrapper">{this.getInputByType()}</div>
      </InputGroup>
    );
  }
}

SettingsInput.propTypes = {
  className: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  type: PropTypes.string.isRequired,
  data: PropTypes.array,
  onChange: PropTypes.func,
  settingsKey: PropTypes.string,
  settingsValueKey: PropTypes.string,
  templatesAdminStore: PropTypes.object.isRequired,
  authStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('templatesAdminStore', 'authStore', 'localeStore'), observer);

export default enhance(SettingsInput);
