import React from 'react';
import ReactDOM from 'react-dom';
import SignInFormContainer from './js/SignInFormContainer';
// import registerServiceWorker from './registerServiceWorker';

// import './scss/styles.scss';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.hydrate(<SignInFormContainer />, document.getElementsByClassName('signin-form-wrapper')[0]);
});

if (process.env.NODE_ENV === 'developlemt') {
  module.hot.accept();
}
// registerServiceWorker();
