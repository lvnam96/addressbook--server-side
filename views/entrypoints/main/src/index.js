// import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';

import { save as saveToLocalStorage } from './js/services/localStorageService';
import { checkStorageAvailable } from './js/helpers/checkSupportedFeaturesHelper';

import App from './js/App';

import './scss/style.scss';

const render = (App) => {
    ReactDOM.render(
        <AppContainer>
            <Provider store={adbk.redux.store}>
                <App />
            </Provider>
        </AppContainer>,
        document.getElementsByClassName('body-wrapper')[0]
    );
};

document.addEventListener('DOMContentLoaded', () => {
    adbk.init(() => {
        render(App);
    });

    const saveDataBeforeCloseTab = (e = window.event) => {
        // if (ls.shouldBeSaved()) {
            saveToLocalStorage(adbk.redux.store.getState().contacts);
            // ls.dontSaveAgain();
        // }
        // if (e) { e.returnValue = 'Sure?'; }// For IE and Firefox prior to version 4
        // return 'Sure?';// For Safari
    };
    window.addEventListener('beforeunload', saveDataBeforeCloseTab, false);
});

if (!checkStorageAvailable('localStorage')) {
    alert('Sorry, your browser does NOT support Local Storage.\nWe will not be able to save your data.');
}

if (process.env.NODE_ENV !== 'production') {
    window.adbk = adbk;// make adbk global

    if (module.hot) {
        module.hot.accept('./js/App.js', () => {
            const HotReloadedApp = require('./js/App').default;
            render(HotReloadedApp);
        });
    }
}
