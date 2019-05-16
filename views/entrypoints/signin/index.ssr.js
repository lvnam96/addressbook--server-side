import React from 'react';
import ReactDOMServer from 'react-dom/server';
import SignInFormContainer from './js/SignInFormContainer';

export default ReactDOMServer.renderToString(<SignInFormContainer />);
