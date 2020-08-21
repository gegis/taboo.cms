import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import TemplatesHelper from 'modules/templates/ui/helpers/TemplatesHelper';
import Translation from 'modules/core/ui/components/Translation';

class NotFound extends React.Component {
  getTitle() {
    const { localeStore } = this.props;
    return localeStore.getTranslation('Not Found');
  }

  render() {
    const { templatesStore } = this.props;
    const Template = TemplatesHelper.getDefaultTemplate({ templatesStore });
    return (
      <Template metaTitle={this.getTitle()} subtitle={this.getTitle()} title="404" className="not-found">
        <div className="section dark" style={{ minHeight: '400px' }}>
          <h2 style={{ textAlign: 'center' }}>
            <Translation message="Page Not Found" />
          </h2>
          <div className="v-spacer-5" />
          <div className="v-spacer-5" />
          <h4 style={{ textAlign: 'center' }}>Oops! The page you are trying to view was not found</h4>
          <div className="v-spacer-5" />
          <div className="v-spacer-5" />
          <p style={{ textAlign: 'center' }}>
            <NavLink className="rs-btn rs-btn-ghost white" to="/" activeClassName="active-alt">
              Go To Home Page
            </NavLink>
          </p>
        </div>
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
