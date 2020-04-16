import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import { InputGroup, Input, InputPicker } from 'rsuite';
import PropTypes from 'prop-types';

import Translation from 'modules/core/client/components/Translation';

class SettingsInput extends React.Component {
  constructor(props) {
    super(props);
    this.templatesStore = props.templatesStore;
  }

  getInputByType() {
    const { type, settingsKey, settingsValueKey, data } = this.props;
    let input = null;
    let settingsItem = null;
    let settingsOnChange = null;

    switch (settingsKey) {
      case 'settings':
        settingsItem = this.templatesStore.settings;
        settingsOnChange = this.templatesStore.onSettingsChange;
        break;
      case 'languageSettings':
        settingsItem = this.templatesStore.languageSettings;
        settingsOnChange = this.templatesStore.onLanguageSettingsChange;
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
  settingsKey: PropTypes.string.isRequired,
  settingsValueKey: PropTypes.string.isRequired,
  templatesStore: PropTypes.object.isRequired,
};

const enhance = compose(inject('templatesStore'), observer);

export default enhance(SettingsInput);
