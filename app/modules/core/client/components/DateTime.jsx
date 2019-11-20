import React from 'react';
import { FormattedDate } from 'react-intl';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

class DateTime extends React.Component {
  render() {
    const {
      value,
      localeStore,
      year = 'numeric',
      month = 'short',
      day = 'numeric',
      hour = 'numeric',
      minute = 'numeric',
      second = 'numeric',
      ...rest
    } = this.props;

    const date = { year, month, day };
    const time = { hour, minute, second };

    if (value) {
      return <FormattedDate className={localeStore.locale} value={value} {...date} {...time} {...rest} />;
    } else {
      return null;
    }
  }
}

DateTime.propTypes = {
  localeStore: PropTypes.object,
  value: PropTypes.string,
  year: PropTypes.string,
  month: PropTypes.string,
  day: PropTypes.string,
  hour: PropTypes.string,
  minute: PropTypes.string,
  second: PropTypes.string,
};

// WORKAROUND - Making to observe localeStore.locale - just to make this component re-render on language change
// As in some child components when they are made observers,
// suddenly intl locale and translations changes are not propagated down to them
const enhance = compose(
  inject('localeStore'),
  observer
);

export default enhance(DateTime);
