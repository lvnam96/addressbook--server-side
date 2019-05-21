import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { checkStorageAvailable } from './helpers/checkSupportedFeaturesHelper';
import * as storeActions from './storeActions';

import NotiBar from './components/NotiBar';
import SettingsPage from './pages/Settings';
import MainPage from './pages/Main';

const App = (props) => {
  const notifications = props.notiList.map(({ type, msg, displayTimeDuration, id }) => (
    <NotiBar displayTimeDuration={displayTimeDuration} type={type} msg={msg} key={id} />
  ));
  useEffect(() => {
    if (!checkStorageAvailable('localStorage')) {
      storeActions.showNoti('alert', 'Sorry, your browser does NOT support saving your data locally.');
    }
  }, []);

  return (
    <>
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={({ match, location, history }) => {
              return (
                <>
                  <MainPage
                    contacts={props.contacts}
                    filterState={props.filterState}
                    toggleMarkedItem={storeActions.toggleMarkedItem}
                    showNoti={storeActions.showNoti}
                  />
                </>
              );
            }}
          />
          <Route path="/settings" component={SettingsPage} />
          <Route render={({ match, location, history }) => <div>404 Not Found</div>} />
        </Switch>
      </Router>
      {notifications}
    </>
  );
};

App.propTypes = {
  // props from redux store provider:
  // dispatch: PropTypes.func.isRequired,
  contacts: PropTypes.arrayOf(PropTypes.instanceOf(adbk.classes.Contact)).isRequired,
  filterState: PropTypes.number.isRequired,
  notiList: PropTypes.arrayOf(PropTypes.object).isRequired,
  // contactIndex: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({ ...state });

export default connect(mapStateToProps)(App);
