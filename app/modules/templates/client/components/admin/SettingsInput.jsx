import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import { InputGroup, Input, InputPicker } from 'rsuite';
import PropTypes from 'prop-types';

import Translation from 'modules/core/client/components/Translation';
import SocketsClient from 'modules/core/client/helpers/SocketsClient';

class SettingsInput extends React.Component {
  constructor(props) {
    super(props);
    this.templatesStore = props.templatesStore;
    this.templatePreviewEvent = 'template-preview'; // TODO (layouts) think of unique event per user id
    this.changesTimeout = null;
    this.changesTimeoutDelay = 300;
    this.onSettingsChange = this.onSettingsChange.bind(this);
    this.onLanguageSettingsChange = this.onLanguageSettingsChange.bind(this);
    this.emitTemplateChanges = this.emitTemplateChanges.bind(this);
  }

  componentDidMount() {
    SocketsClient.join('users');
  }

  emitTemplateChanges() {
    clearTimeout(this.changesTimeout);
    this.changesTimeout = setTimeout(() => {
      SocketsClient.emit(this.templatePreviewEvent, this.templatesStore.item);
    }, this.changesTimeoutDelay);
  }

  onSettingsChange(key, value) {
    const { onChange = null } = this.props;
    this.templatesStore.onSettingsChange(key, value);
    this.emitTemplateChanges();
    if (onChange && typeof onChange === 'function') {
      onChange(key, value, 'settings');
    }
  }

  onLanguageSettingsChange(key, value) {
    const { onChange = null } = this.props;
    this.templatesStore.onLanguageSettingsChange(key, value);
    this.emitTemplateChanges();
    if (onChange && typeof onChange === 'function') {
      onChange(key, value, 'languageSettings');
    }
  }

  getInputByType() {
    const { type, settingsKey, settingsValueKey, data } = this.props;
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
    }

    return input;
  }

  render() {
    const { label } = this.props;

    return (
      <InputGroup classPrefix="input-group-wrapper">
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
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  type: PropTypes.string.isRequired,
  data: PropTypes.array,
  onChange: PropTypes.func,
  settingsKey: PropTypes.string.isRequired,
  settingsValueKey: PropTypes.string.isRequired,
  templatesStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('templatesStore'), observer);

export default enhance(SettingsInput);
