import React from 'react';
const { renderToString } = require('react-dom/server');
import SignInFormContainer from './js/SignInFormContainer';

export default renderToString(<SignInFormContainer />);
