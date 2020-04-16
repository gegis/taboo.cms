import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';

class Template extends React.Component {
  constructor(props) {
    super(props);
    this.localeStore = props.localeStore;
  }

  render() {
    return <div>Custom1 Settings</div>;
  }
}

Template.propTypes = {
  localeStore: PropTypes.object,
};

const enhance = compose(inject('localeStore'), observer);

export default enhance(Template);
