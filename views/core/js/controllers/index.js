import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import * as Sentry from '@sentry/browser';
import alo, { handleFailedRequest, handleServerResponse } from '../services/httpServices';

// other controllers:
// import app from '../../../entrypoints/main/src/js/controllers/adbk';
// import signin from '../../../entrypoints/signin/js//controllers/index';
// import signup from '../../../entrypoints/signup/js//controllers/index';

class Controller {
  _status = {
    isDataLoaded: false,
    isDev: process.env.NODE_ENV === 'development',
  };

  get status() {
    return this._status;
  }

  alo = alo;

  getRequest = (...args) => {
    return alo
      .get(...args)
      .then(handleServerResponse)
      .catch(handleFailedRequest);
  };

  postRequest = (...args) => {
    return alo
      .post(...args)
      .then(handleServerResponse)
      .catch(handleFailedRequest);
  };
}

const controller = new Controller();

export default controller;
