import React from 'react';
const { renderToString } = require('react-dom/server');
import SignUpFormContainer from './js/SignUpFormContainer';

export default renderToString(<SignUpFormContainer />);
