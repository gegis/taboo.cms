import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';
import NotFound from 'app/themes/admin/ui/components/NotFound';
import AdminRoute from 'app/modules/core/ui/components/admin/AdminRoute';
import SocketsClient from 'modules/core/ui/helpers/SocketsClient';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.loadAuthTimeout = null;
    this.loadAuthTimeoutMs = 1000 * 60 * 10;
    this.getRoutes = this.getRoutes.bind(this);
    this.autoLoadAuth = this.autoLoadAuth.bind(this);
  }

  componentDidMount() {
    this.autoLoadAuth();
    SocketsClient.join('admin');
  }

  componentWillUnmount() {
    clearTimeout(this.loadAuthTimeout);
  }

  autoLoadAuth() {
    const { authStore } = this.props;
    authStore.loadUserAuth();
    clearTimeout(this.loadAuthTimeout);
    this.loadAuthTimeout = setTimeout(() => {
      this.autoLoadAuth();
    }, this.loadAuthTimeoutMs);
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

const enhance = compose(withRouter, inject('localeStore', 'authStore'), observer);

export default enhance(App);
