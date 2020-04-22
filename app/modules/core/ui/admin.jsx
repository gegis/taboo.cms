import React from 'react';
import ReactDOM from 'react-dom';
import { configure } from 'mobx';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'mobx-react';
import { syncHistoryWithStore } from 'mobx-react-router';

import AdminConfigHelper from './helpers/AdminConfigHelper';
import App from './components/admin/App';

const routes = AdminConfigHelper.getRoutes();
const stores = AdminConfigHelper.getStores();

// Force stores to use actions to modify state
configure({ enforceActions: 'always' });

const browserHistory = createBrowserHistory();
const appHistory = syncHistoryWithStore(browserHistory, stores.routerStore);

ReactDOM.render(
  <Provider {...stores}>
    <Router history={appHistory}>
      <App routes={routes} />
    </Router>
  </Provider>,
  document.getElementById('root')
);
