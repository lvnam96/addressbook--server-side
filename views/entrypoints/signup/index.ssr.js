import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import SignUpFormContainer from './js/SignUpFormContainer';

export default ReactDOMServer.renderToString(<SignUpFormContainer />);
