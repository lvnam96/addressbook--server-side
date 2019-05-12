import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers/index';
import thunk from 'redux-thunk';
// import { load as loadContactsList } from './services/localStorageService';

const logger = store => next => action => {
    console.log('dispatching', action);
    let result = next(action);
    console.log('next state', store.getState());
    return result;
};
const initialState = {
    contacts: [],// loadContactsList() || [],
    notiList: [],
    filterState: 0
};

export default createStore(
    rootReducer,
    initialState,
    applyMiddleware(logger, thunk)
);
