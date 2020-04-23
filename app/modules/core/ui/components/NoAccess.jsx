import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';

class NoAccess extends React.Component {
  render() {
    const { templatesStore: { templateComponents = {}, defaultTemplateName = '' } = {} } = this.props;
    const Template = templateComponents[defaultTemplateName];
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
