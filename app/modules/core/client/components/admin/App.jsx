import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';
import NotFound from './NotFound';
import AdminRoute from 'app/modules/core/client/components/admin/AdminRoute';

class App extends React.Component {
  constructor(props) {
    super(props);
    const { authStore } = props;
    authStore.loadUserAuth();
    this.getRoutes = this.getRoutes.bind(this);
  }

  getRoutes() {
    const { routes } = this.props;
    const appRoutes = [];
    let key = 0;
    routes.map((route, i) => {
      key = i;
      if (route.admin) {
        appRoutes.push(<AdminRoute key={i} {...route} />);
      } else {
        appRoutes.push(<Route key={i} {...route} />);
      }
    });
    appRoutes.push(<Route key={key + 1} component={NotFound} />);
    return appRoutes;
  }

  render() {
    const { localeStore } = this.props;
    return (
      <IntlProvider locale={localeStore.locale} messages={localeStore.translations}>
        <Switch>{this.getRoutes()}</Switch>
      </IntlProvider>
    );
  }
}

App.propTypes = {
  localeStore: PropTypes.object.isRequired,
  authStore: PropTypes.object.isRequired,
  routes: PropTypes.array.isRequired,
};

const enhance = compose(
  withRouter,
  inject('localeStore', 'authStore'),
  observer
);

export default enhance(App);
