import React from 'react';
import { FormattedRelativeTime } from 'react-intl';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import DateTime from 'modules/core/ui/components/DateTime';

class RelativeTime extends React.Component {
  render() {
    let {
      value = null,
      dateTimeValue = null,
      localeStore,
      numeric = 'auto',
      style = 'long',
      unit = 'hour',
      updateIntervalInSeconds = '60',
      unitsToUseDateTime = [],
      futureDates = true,
      ...rest
    } = this.props;

    if (['second', 'minute', 'hour'].indexOf(unit) === -1) {
      updateIntervalInSeconds = null;
    }

    if (value !== null) {
      if (unitsToUseDateTime.indexOf(unit) !== -1 && dateTimeValue) {
        return <DateTime value={dateTimeValue} month="numeric" />;
      } else {
        if (!futureDates && value >= 0) {
          value = -1;
          unit = 'second';
        }
        return (
          <FormattedRelativeTime
            className={localeStore.locale}
            value={value}
            numeric={numeric}
            style={style}
            unit={unit}
            updateIntervalInSeconds={updateIntervalInSeconds}
            {...rest}
          />
        );
      }
    } else {
      return null;
    }
  }
}

RelativeTime.propTypes = {
  localeStore: PropTypes.object,
  value: PropTypes.number,
  dateTimeValue: PropTypes.string,
  numeric: PropTypes.string, // 'always' | 'auto';
  style: PropTypes.string, //'long' | 'short' | 'narrow';
  unit: PropTypes.string,
  format: PropTypes.string,
  updateIntervalInSeconds: PropTypes.number,
  unitsToUseDateTime: PropTypes.array,
  futureDates: PropTypes.bool,
};

// WORKAROUND - Making to observe localeStore.locale - just to make this component re-render on language change
// As in some child components when they are made observers,
// suddenly intl locale and translations changes are not propagated down to them
const enhance = compose(inject('localeStore'), observer);

export default enhance(RelativeTime);
