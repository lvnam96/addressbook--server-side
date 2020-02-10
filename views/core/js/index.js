/* global __webpack_nonce__ */ // eslint-disable-line no-unused-vars
import 'core-js/stable';
import 'regenerator-runtime/runtime';
// import React from 'react';
// import ReactDOM from 'react-dom';

import '../scss/styles.scss';

import './shims/requestIdleCallback';

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line camelcase,no-global-assign
  __webpack_nonce__ = window.NONCE_ID; // see https://github.com/styled-components/styled-components/issues/887#issuecomment-376479268
});
