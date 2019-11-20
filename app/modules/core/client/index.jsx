import React from 'react';
import ReactDOM from 'react-dom';
import { configure } from 'mobx';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'mobx-react';
import { syncHistoryWithStore } from 'mobx-react-router';

import ConfigHelper from './helpers/ConfigHelper';
import App from './components/App';

const routes = ConfigHelper.getRoutes();
const stores = ConfigHelper.getStores();

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
