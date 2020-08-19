import React from 'react';
import { compose } from 'recompose';
import { observer, inject } from 'mobx-react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';
import NotFound from 'app/modules/core/ui/components/NotFound';
import UserRoute from 'app/modules/core/ui/components/UserRoute';
import SocketsClient from 'app/modules/core/ui/helpers/SocketsClient';
import TemplatesHelper from 'modules/templates/ui/helpers/TemplatesHelper';
import UiHelper from 'modules/core/ui/helpers/UiHelper';
import UsersHelper from 'modules/users/ui/helpers/UsersHelper';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.loadAuthTimeout = null;
    this.loadAuthTimeoutMs = 1000 * 60 * 5;
    this.getRoutes = this.getRoutes.bind(this);
  }

  componentDidMount() {
    const { authStore, templatesStore } = this.props;
    templatesStore.loadDefaultTemplate();
    authStore.loadUserAuth().then(() => {
      if (authStore.user && authStore.user.admin) {
        SocketsClient.join('admin').then(() => {
          const eventName = TemplatesHelper.getTemplatePreviewReceiveEventName({ authStore, templatesStore });
          SocketsClient.on(eventName, template => {
            templatesStore.setPreviewTemplate(template);
          });
        });
      }
      if (authStore.user && authStore.user.id) {
        SocketsClient.join('users').then(() => {
          SocketsClient.on(UsersHelper.getUserEventName('update', authStore), () => {
            authStore.loadUserAuth();
          });
        });
      }
    });
    this.autoLoadAuth(true);
  }

  componentWillUnmount() {
    const { authStore, templatesStore } = this.props;
    SocketsClient.off(UsersHelper.getUserEventName('update', authStore));
    SocketsClient.off(TemplatesHelper.getTemplatePreviewReceiveEventName({ authStore, templatesStore }));
    clearTimeout(this.loadAuthTimeout);
  }

  componentDidUpdate(prevProps) {
    const { gtag, app: { config: { gaId } = {} } = {} } = window;
    const { location: { pathname = null } = {} } = this.props;
    const { location: { pathname: prevPathname = null } = {} } = prevProps;
    if (pathname !== prevPathname) {
      UiHelper.scrollToTop();
      if (gtag && gaId && pathname) {
        gtag('config', gaId, { page_path: pathname });
      }
    }
  }

  autoLoadAuth(delay = false) {
    const { authStore } = this.props;
    if (!delay) {
      authStore.loadUserAuth();
    }
    clearTimeout(this.loadAuthTimeout);
    this.loadAuthTimeout = setTimeout(() => {
      if (delay) {
        authStore.loadUserAuth();
      }
      this.autoLoadAuth(delay);
    }, this.loadAuthTimeoutMs);
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
