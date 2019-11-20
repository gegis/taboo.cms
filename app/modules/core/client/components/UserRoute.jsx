import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';

import NoAccess from './NoAccess';

class UserRoute extends Component {
  constructor(props) {
    super(props);
    this.aclStore = props.aclStore;
    this.aclStore.refreshACL();
  }

  render() {
    const { authStore, redirectTo, ...routeProps } = this.props;
    if (authStore.authenticated && authStore.user) {
      return <Route {...routeProps} />;
    }
    if (redirectTo) {
      return (
        <Redirect
          to={{
            pathname: redirectTo,
            state: { from: this.props.location },
          }}
        />
      );
    } else {
      return <NoAccess />;
    }
  }
}

UserRoute.propTypes = {
  authStore: PropTypes.object.isRequired,
  aclStore: PropTypes.object.isRequired,
  redirectTo: PropTypes.string,
  location: PropTypes.object,
};

const enhance = compose(
  inject('aclStore', 'authStore'),
  observer
);

export default enhance(UserRoute);
