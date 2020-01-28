import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './js/App.jsx';

export default ReactDOMServer.renderToString(<App />);
