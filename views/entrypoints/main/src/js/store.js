import { createBrowserHistory } from 'history';
import { createStore, applyMiddleware, compose } from 'redux';
import createRootReducer from './reducers/index';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
// import { load as loadContactsList } from './services/localStorageService';

export const history = createBrowserHistory();

let composeEnhancers = compose;
const middlewares = [routerMiddleware(history), thunk];
if (process.env.NODE_ENV === 'development') {
  const logger = ({ getState }) => (next) => (action) => {
    console.group();
    console.log('will dispatch', action);
    const result = next(action);
    console.log('state after dispatch', getState());
    console.groupEnd();
    return result;
  };
  middlewares.push(logger);

  if (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__; // overwrite default composer using redux devtool's composer
  }
}

export const configureStore = (initialState) =>
  createStore(createRootReducer(history), initialState, composeEnhancers(applyMiddleware(...middlewares)));

export default configureStore(); // dont pass initialState to parameters here, let reducers setup their initial states, because each reducer knows which datatype it's dealing with
