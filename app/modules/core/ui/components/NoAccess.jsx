import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import TemplatesHelper from 'modules/templates/ui/helpers/TemplatesHelper';
import Translation from 'modules/core/ui/components/Translation';

class NoAccess extends React.Component {
  getTitle() {
    const { localeStore } = this.props;
    return localeStore.getTranslation('No Access');
  }

  render() {
    const { templatesStore } = this.props;
    const Template = TemplatesHelper.getDefaultTemplate({ templatesStore });
    return (
      <Template metaTitle={this.getTitle()} subtitle={this.getTitle()} title="403" className="not-found">
        <div className="section dark" style={{ minHeight: '400px' }}>
          <h2 style={{ textAlign: 'center' }}>
            <Translation message="No Access" />
          </h2>
        </div>
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
