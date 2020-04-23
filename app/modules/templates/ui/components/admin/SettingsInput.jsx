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
    this.templatesStore = props.templatesStore;
    this.localeStore = props.localeStore;
    this.onSettingsChange = this.onSettingsChange.bind(this);
    this.onLanguageSettingsChange = this.onLanguageSettingsChange.bind(this);
    this.onLanguageChange = this.onLanguageChange.bind(this);
  }

  onSettingsChange(key, value) {
    const { onChange = null, authStore, templatesStore } = this.props;
    this.templatesStore.onSettingsChange(key, value);
    TemplatesHelper.emitTemplateChanges({ authStore, templatesStore });
    if (onChange && typeof onChange === 'function') {
      onChange(key, value, 'settings');
    }
  }

  onLanguageSettingsChange(key, value) {
    const { onChange = null, authStore, templatesStore } = this.props;
    this.templatesStore.onLanguageSettingsChange(key, value);
    TemplatesHelper.emitTemplateChanges({ authStore, templatesStore });
    if (onChange && typeof onChange === 'function') {
      onChange(key, value, 'languageSettings');
    }
  }

  onLanguageChange(value) {
    this.templatesStore.setLanguage(value, true);
  }

  getColorPicker({ settingsItem, settingsValueKey, settingsOnChange }) {
    return (
      <ColorPicker
        input={<Input value={settingsItem[settingsValueKey]} onChange={settingsOnChange} />}
        value={settingsItem[settingsValueKey]}
        returnValueKey="hex"
        onChange={settingsOnChange}
      />
    );
  }

  getImagePicker({ settingsItem, settingsValueKey, settingsOnChange }) {
    return (
      <ImagePicker
        input={<Input value={settingsItem[settingsValueKey]} onChange={settingsOnChange} />}
        value={settingsItem[settingsValueKey]}
        returnValueKey="url"
        onChange={settingsOnChange}
      />
    );
  }

  getInputByType() {
    const { type, settingsKey, settingsValueKey, data } = this.props;
    const { languageOptions } = this.localeStore;
    let input = null;
    let settingsItem = null;
    let settingsOnChange = null;

    switch (settingsKey) {
      case 'settings':
        settingsItem = this.templatesStore.settings;
        settingsOnChange = this.onSettingsChange;
        break;
      case 'languageSettings':
        settingsItem = this.templatesStore.languageSettings;
        settingsOnChange = this.onLanguageSettingsChange;
        break;
    }

    if (settingsOnChange !== null && typeof settingsOnChange === 'function') {
      settingsOnChange = settingsOnChange.bind(this.templatesStore, settingsValueKey);
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
            value={this.templatesStore.language}
            onChange={this.onLanguageChange}
            data={languageOptions}
            cleanable={false}
          />
        );
        break;
      case 'ImagePicker':
        input = this.getImagePicker({ settingsItem, settingsValueKey, settingsOnChange });
        break;
      case 'ColorPicker':
        input = this.getColorPicker({ settingsItem, settingsValueKey, settingsOnChange });
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
  templatesStore: PropTypes.object.isRequired,
  authStore: PropTypes.object.isRequired,
  localeStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('templatesStore', 'authStore', 'localeStore'), observer);

export default enhance(SettingsInput);
