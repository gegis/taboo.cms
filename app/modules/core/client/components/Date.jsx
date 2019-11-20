import React from 'react';
import { FormattedDate } from 'react-intl';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

class Date extends React.Component {
  render() {
    let { value, localeStore, year = 'numeric', month = 'short', day = 'numeric', ...rest } = this.props;
    const date = { year, month, day };

    if (value) {
      return <FormattedDate className={localeStore.locale} value={value} {...date} {...rest} />;
    } else {
      return null;
    }
  }
}

Date.propTypes = {
  localeStore: PropTypes.object,
  value: PropTypes.string,
  year: PropTypes.string,
  month: PropTypes.string,
  day: PropTypes.string,
};

// WORKAROUND - Making to observe localeStore.locale - just to make this component re-render on language change
// As in some child components when they are made observers,
// suddenly intl locale and translations changes are not propagated down to them
const enhance = compose(
  inject('localeStore'),
  observer
);

export default enhance(Date);
