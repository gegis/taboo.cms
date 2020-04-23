import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import TemplatesHelper from 'modules/templates/ui/helpers/TemplatesHelper';
import Translation from 'modules/core/ui/components/Translation';

class NotFound extends React.Component {
  render() {
    const { localeStore, templatesStore } = this.props;
    const Template = TemplatesHelper.getDefaultTemplate({ templatesStore });
    return (
      <Template metaTitle={localeStore.getTranslation('Not Found')} className="not-found">
        <h1>404</h1>
        <p>
          <Translation message="Not Found" />
        </p>
      </Template>
    );
  }
}

NotFound.propTypes = {
  templatesStore: PropTypes.object,
  localeStore: PropTypes.object,
};

const enhance = compose(inject('templatesStore', 'localeStore'), observer);

export default enhance(NotFound);
