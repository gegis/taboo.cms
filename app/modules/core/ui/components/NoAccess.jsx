import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import TemplatesHelper from 'modules/templates/ui/helpers/TemplatesHelper';

class NoAccess extends React.Component {
  render() {
    const Template = TemplatesHelper.getDefaultTemplate({ templatesStore: this.props.templatesStore });
    return (
      <Template metaTitle="403" className="not-access">
        <h1>403</h1>
        <p>No Access</p>
      </Template>
    );
  }
}

NoAccess.propTypes = {
  templatesStore: PropTypes.object,
};

const enhance = compose(inject('templatesStore'), observer);

export default enhance(NoAccess);
