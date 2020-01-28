import React, { useEffect, StrictMode } from 'react';
import { Provider } from 'react-redux';
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader/root';

import { checkStorageAvailable } from './helpers/checkSupportedFeaturesHelper';

import AppErrorCatcher from './components/ErrorBoundaries/AppErrorBoundary.jsx';
import Notifications from './components/Notification/Notification.jsx';
import GlobalConfirmDialog from './components/Dialog/GlobalConfirmDialog.jsx';
import AsyncLoader from './components/AsyncLoader/AsyncLoader.jsx';
const SettingsPage = React.lazy(() => import('./pages/Settings'));
const MainPage = React.lazy(() => import(/* webpackPreload: true */ './pages/Main'));
const redux = adbk.redux;

const App = (props) => {
  useEffect(() => {
    if (!checkStorageAvailable('localStorage')) {
      adbk.showNoti('alert', 'Sorry, your browser does NOT support saving your data locally.');
    }
  }, []);

  return (
    <AppErrorCatcher>
      <StrictMode>
        <Provider store={redux.store} context={redux.context}>
          <ConnectedRouter history={redux.history} context={redux.context}>
            <Switch>
              <Route
                exact
                path="/settings"
                render={({ match, location, history }) => (
                  <AsyncLoader>
                    <SettingsPage />
                  </AsyncLoader>
                )}
              />
              <Route
                path={['/cbooks/:cbookId?', '/:cbookId?']}
                render={(routeProps) => (
                  <AsyncLoader>
                    <MainPage />
                  </AsyncLoader>
                )}
              />
              <Route render={({ match, location, history }) => <div>404 Not Found</div>} />
            </Switch>
          </ConnectedRouter>
          <GlobalConfirmDialog />
          <Notifications />
        </Provider>
      </StrictMode>
    </AppErrorCatcher>
  );
};
export default hot(App);
