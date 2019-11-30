import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Panel, Button, ButtonToolbar } from 'rsuite';
import Layout from './Layout';
import Translation from 'app/modules/core/client/components/Translation';
import ButtonLink from 'app/modules/core/client/components/admin/ButtonLink';

class NoAccess extends React.Component {
  render() {
    const { history, authStore } = this.props;
    return (
      <Layout pageTitle="No Access" className="no-access" sidebar={false}>
        <Panel className="shadow">
          <h4>
            <Translation message="You have no access." />
          </h4>
          <ButtonToolbar>
            <Button appearance="default" onClick={history.goBack}>
              <Translation message="Go back" />
            </Button>
            {!authStore.authenticated && (
              <ButtonLink appearance="primary" to="/admin/login">
                <Translation message="Go to login page" />
              </ButtonLink>
            )}
          </ButtonToolbar>
        </Panel>
      </Layout>
    );
  }
}

NoAccess.propTypes = {
  authStore: PropTypes.object,
  history: PropTypes.object,
};

const enhance = compose(withRouter, inject('authStore'), observer);

export default enhance(NoAccess);
