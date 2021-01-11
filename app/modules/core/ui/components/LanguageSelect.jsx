import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import { InputPicker } from 'rsuite';

class LanguageSelect extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(language) {
    const { localeStore, templatesStore } = this.props;
    localeStore.setLanguage(language);
    templatesStore.setLanguage(language);
  }

  render() {
    const { localeStore } = this.props;
    return (
      <InputPicker
        className="language-select"
        value={localeStore.language}
        onChange={this.onChange}
        cleanable={false}
        data={localeStore.languageOptions}
      />
    );
  }
}

LanguageSelect.propTypes = {
  localeStore: PropTypes.object,
  templatesStore: PropTypes.object,
};

const enhance = compose(inject('localeStore', 'templatesStore'), observer);

export default enhance(LanguageSelect);
