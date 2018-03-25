import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers/index';

import { checkStorageAvailable } from './helpers/checkSupportedFeaturesHelper';
import { loadData } from './services/localStorageService';

const logger = store => next => action => {
        console.log('dispatching', action);
        let result = next(action);
        console.log('next state', store.getState());
        return result;
    },
    initialState = {
        contacts: (() => {
            // get data from localStorage if exist
            if (checkStorageAvailable('localStorage') && typeof localStorage.contactsList !== 'undefined') {
                return loadData();
            } else {
                alert('Sorry, your browser does NOT support Local Storage.\nWe will not be able to save your data.');
            }
            return [];
        })(),
        filterState: 0
    };

export default createStore(
    rootReducer,
    initialState,
    applyMiddleware(logger)
);
