import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import TemplatesHelper from 'modules/templates/ui/helpers/TemplatesHelper';

class NotFound extends React.Component {
  render() {
    const Template = TemplatesHelper.getDefaultTemplate({ templatesStore: this.props.templatesStore });
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
