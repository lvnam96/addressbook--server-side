import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers/index';
import thunk from 'redux-thunk';

const logger = store => next => action => {
        console.log('dispatching', action);
        let result = next(action);
        console.log('next state', store.getState());
        return result;
    },
    initialState = {
        contacts: [],//loadDataFromLocalStorage() || [],
        notiList: [],
        filterState: 0
    };

export default createStore(
    rootReducer,
    initialState,
    applyMiddleware(logger, thunk)
);
