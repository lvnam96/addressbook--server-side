import 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/App.jsx';
// import registerServiceWorker from './registerServiceWorker';

// import './scss/styles.scss';

const hydrate = (App) => {
  ReactDOM.hydrate(<App />, document.getElementsByClassName('signup-form-wrapper')[0]);
};

document.addEventListener('DOMContentLoaded', () => {
  hydrate(App);
});

if (core.status.isDev) {
  if (module.hot) {
    module.hot.accept('./js/App.jsx', () => {
      const HotReloadedApp = require('./js/App.jsx').default;
      hydrate(HotReloadedApp);
    });
  }

  // var axe = require('react-axe');
  // axe(React, ReactDOM, 1000);
}

// registerServiceWorker();
