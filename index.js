import "babel-polyfill";
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './js/store';

import * as ls from './js/services/localStorageService';

import AddressBook from './js/AddressBook';

import './scss/style.scss';

document.addEventListener('DOMContentLoaded', () => {
    const saveDataBeforeCloseTab = (e = window.event) => {
        // if (ls.shouldBeSaved()) {
            ls.save(store.getState().contacts);
            // ls.dontSaveAgain();
        // }
        if (e) { e.returnValue = 'Sure?'; }// For IE and Firefox prior to version 4
        return 'Sure?';// For Safari
    };

    render(
        <Provider store={store}>
            <AddressBook />
        </Provider>,
        document.getElementsByClassName('body-wrapper')[0]
    );

    window.addEventListener('beforeunload', saveDataBeforeCloseTab, false);
});