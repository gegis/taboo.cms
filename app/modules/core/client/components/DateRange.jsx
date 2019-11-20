import DateRangePicker from '../../../../../node_modules/rsuite/lib/DateRangePicker/DateRangePicker';

class DateRange extends DateRangePicker {
  getDateString(value) {
    const { placeholder, format } = this.props;
    const dates = value || this.getValue();
    let from, to;
    let preview = placeholder;
    if (dates) {
      if (dates[0]) {
        from = dates[0].clone();
      }
      if (dates[1]) {
        to = dates[1].clone();
      }
    }
    if (from && to) {
      preview = `${from.format(format)} - ${to.format(format)}`;
    }
    return preview;
  }
}

export default DateRange;
