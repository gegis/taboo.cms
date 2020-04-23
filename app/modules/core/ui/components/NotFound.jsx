import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';

class NotFound extends React.Component {
  render() {
    const { templatesStore: { templateComponents = {}, defaultTemplateName = '' } = {} } = this.props;
    const Template = templateComponents[defaultTemplateName];
    return (
      <Template pageTitle="Not Found" className="not-found">
        Not Found
      </Template>
    );
  }
}

NotFound.propTypes = {
  templatesStore: PropTypes.object,
};

const enhance = compose(inject('templatesStore'), observer);

export default enhance(NotFound);
