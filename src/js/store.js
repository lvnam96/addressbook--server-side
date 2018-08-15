import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers/index';

import { checkStorageAvailable } from './helpers/checkSupportedFeaturesHelper';
import { loadData as loadDataFromLocalStorage } from './services/localStorageService';

const logger = store => next => action => {
        console.log('dispatching', action);
        let result = next(action);
        console.log('next state', store.getState());
        return result;
    },
    initialState = {
        contacts: (() => {
            // if (checkStorageAvailable('localStorage')) {
            //     if (typeof localStorage.contactsList !== 'undefined') {
            //         return loadDataFromLocalStorage();
            //     }
            // } else {
            //     alert('Sorry, your browser does NOT support Local Storage.\nWe will not be able to save your data.');
            // }
            // return [];

            if (!checkStorageAvailable('localStorage')) {
                alert('Sorry, your browser does NOT support Local Storage.\nWe will not be able to save your data.');
            }
            return loadDataFromLocalStorage() || [];// get data from localStorage if exist
        })(),
        filterState: 0
    };

export default createStore(
    rootReducer,
    initialState,
    applyMiddleware(logger)
);
