import API from './js/API';
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';

import AddressBook from './js/components/AddressBook';

import './scss/style.scss';

API.init();

document.addEventListener('DOMContentLoaded', () => {
    const clsTab = e => {
        if (API.shouldBeSaved()) {
            API.saveDataToLocalStorage();
            API.dontSaveDataToLocalStorageAgain();
        }
        // e = e || window.event;
        // if (e) { e.returnValue = 'Sure?'; }// For IE and Firefox prior to version 4
        // return 'Sure?';// For Safari
    };

    render(
        <BrowserRouter>
            <Route path="/" component={AddressBook} />
        </BrowserRouter>,
        document.getElementsByClassName('body-wrapper')[0]
    );

    window.addEventListener('beforeunload', clsTab, false);
});