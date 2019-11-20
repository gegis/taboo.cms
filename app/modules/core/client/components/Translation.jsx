import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

class Translation extends Component {
  render() {
    const { config } = window.app;
    let { message, values, id } = this.props;
    if (!values) {
      values = {};
    }
    if (!id) {
      id = message;
    }
    if (!message) {
      message = id;
    }
    // Do not set default message if we are in debug mode
    if (config.env === 'debug') {
      message = null;
    }
    if (!id && !message) {
      return null;
    } else {
      return <FormattedMessage id={id} defaultMessage={message} values={values} />;
    }
  }
}

Translation.propTypes = {
  message: PropTypes.string,
  values: PropTypes.object,
  id: PropTypes.string,
};

export default Translation;
