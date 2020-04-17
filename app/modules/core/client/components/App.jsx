import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';
import NotFound from 'app/modules/core/client/components/NotFound';
import UserRoute from 'app/modules/core/client/components/UserRoute';
import SocketsClient from 'app/modules/core/client/helpers/SocketsClient';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.getRoutes = this.getRoutes.bind(this);
  }

  componentDidMount() {
    const { authStore, templatesStore } = this.props;
    authStore.loadUserAuth();
    templatesStore.loadDefaultTemplate();
    SocketsClient.join('users').then(() => {
      // In case user is logged in, but refreshes page
      SocketsClient.on(this.getUserEventName('update'), () => {
        authStore.loadUserAuth();
      });
    });
  }

  componentWillUnmount() {
    SocketsClient.off(this.getUserEventName('update'));
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  getUserEventName(action) {
    const { authStore } = this.props;
    let eventName = null;
    if (authStore.user && authStore.user.id) {
      eventName = `user-${authStore.user.id}-user-${action}`;
    }
    return eventName;
  }

  getRoutes() {
    const { routes } = this.props;
    const appRoutes = [];
    let key = 0;
    routes.map((route, i) => {
      key = i;
      if (route.authorised) {
        appRoutes.push(<UserRoute key={i} {...route} />);
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
  templatesStore: PropTypes.object.isRequired,
  routes: PropTypes.array.isRequired,
  location: PropTypes.object,
};

const enhance = compose(withRouter, inject('localeStore', 'authStore', 'templatesStore'), observer);

export default enhance(App);
