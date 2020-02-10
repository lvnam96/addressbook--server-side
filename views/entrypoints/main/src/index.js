/* global __webpack_nonce__ */ // eslint-disable-line no-unused-vars
// import "@babel/polyfill";
import 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import { init as InitSentry } from '@sentry/browser';

import { save as saveToLocalStorage } from './js/services/localStorageService';

import App from './js/App.jsx';

import './scss/style.scss';

const render = (App) => {
  ReactDOM.render(<App />, document.getElementsByClassName('body-wrapper')[0]);
};

if (adbk.status.isDev) {
  // use either below code or webpackConfig.output.publicPath
  // have to check whether it works in production build
  // __webpack_public_path__ = window.location.origin + '/';
  // __webpack_public_path__ = (window.location.origin || 'http://localhost:2711') + '/';

  window.adbk = adbk; // make adbk global in dev browser console
  // window.jQuery = $ || jQuery; // make jQuery global in dev browser console

  if (module.hot) {
    module.hot.accept('./js/App.jsx', () => {
      const HotReloadedApp = require('./js/App.jsx').default;
      render(HotReloadedApp);
    });
    module.hot.accept('./js/reducers', () => {
      const rootReducer = require('./js/reducers').default;
      adbk.redux.store.replaceReducer(rootReducer(adbk.redux.history));
    });
  }
  // var axe = require('react-axe');
  // axe(React, ReactDOM, 1000);
} else {
  InitSentry({ dsn: 'https://1565fd570acb4fce8570ab304708967a@sentry.io/1842904' });
}

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line camelcase,no-global-assign
  __webpack_nonce__ = window.NONCE_ID; // see "core" entrypoint

  adbk.init(); // load data from API
  render(App); // render UI w/ empty data, controller will update UI when data is fully loaded

  const saveDataBeforeCloseTab = (e = window.event) => {
    // if (ls.shouldBeSaved()) {
    saveToLocalStorage(adbk.redux.store.getState().contacts);
    // ls.dontSaveAgain();
    // }
    // if (e) { e.returnValue = 'Sure?'; }// For IE and Firefox prior to version 4
    // return 'Sure?';// For Safari
  };
  window.addEventListener('beforeunload', saveDataBeforeCloseTab, false);
});
