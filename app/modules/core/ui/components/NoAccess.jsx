import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import TemplatesHelper from 'modules/templates/ui/helpers/TemplatesHelper';
import Translation from 'modules/core/ui/components/Translation';

class NoAccess extends React.Component {
  render() {
    const { localeStore, templatesStore } = this.props;
    const Template = TemplatesHelper.getDefaultTemplate({ templatesStore });
    return (
      <Template metaTitle={localeStore.getTranslation('No Access')} className="no-access">
        <h1>403</h1>
        <p>
          <Translation message="No Access" />
        </p>
      </Template>
    );
  }
}

NoAccess.propTypes = {
  templatesStore: PropTypes.object,
  localeStore: PropTypes.object,
};

const enhance = compose(inject('templatesStore', 'localeStore'), observer);

export default enhance(NoAccess);
