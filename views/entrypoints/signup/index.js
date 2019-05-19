import React from 'react';
import ReactDOM from 'react-dom';
import SignUpFormContainer from './js/SignUpFormContainer';
// import registerServiceWorker from './registerServiceWorker';

// import './scss/styles.scss';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.hydrate(<SignUpFormContainer />, document.getElementsByClassName('signup-form-wrapper')[0]);
});

if (process.env.NODE_ENV === 'developlemt') {
  module.hot.accept();
}
// registerServiceWorker();
