import React from 'react';
import ReactDOMServer from 'react-dom/server';
import SignUpFormContainer from './js/SignUpFormContainer';

export default ReactDOMServer.renderToString(<SignUpFormContainer />);
