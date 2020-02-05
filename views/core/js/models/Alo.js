import axios from 'axios';
import _isEmpty from 'lodash/isEmpty';
import Cookies from 'js-cookie';
const CancelToken = axios.CancelToken;

// 3 cases:
// 1 front-end dev (NODE_ENV !== 'production')
// 2 node server dev, prod front-end build (NODE_ENV === 'production')

// const localhostURL = 'http://localhost';
// const FE_DEV_DOMAIN = localhostURL + ':' + process.env.PORT;
// const BE_DEV_DOMAIN = localhostURL + ':' + 3000;
const PROD_DOMAIN = typeof window !== 'undefined' ? window.location.origin : 'https://contacts.garyle.me';
const customAxiosOptions = {
  timeout: 30000, // default: 0
  // withCredentials: true,
  headers: {},
  xsrfCookieName: 'XSRF-TOKEN', // default
  xsrfHeaderName: 'X-XSRF-TOKEN', // default
  // transformRequest: [() => {}],
  // transformResponse: [() => {}],
  baseURL: PROD_DOMAIN + '/',
};

export class Alo {
  constructor() {
    // const DEV_STR = 'development';
    // this._isFEDev = process.env.FE_ENV === DEV_STR;
    // this._isBEDev = process.env.BE_ENV === DEV_STR;
    // this._isDev = process.env.NODE_ENV === DEV_STR;

    // if (this._isFEDev) {
    //   customAxiosOptions.baseURL = FE_DEV_DOMAIN;
    // } else if (this._isBEDev || this._isDev) {
    //   customAxiosOptions.baseURL = BE_DEV_DOMAIN;
    // } else {
    //   customAxiosOptions.baseURL = PROD_DOMAIN;
    // }
    // customAxiosOptions.baseURL += '/';
    this._axios = axios.create(customAxiosOptions);

    // only use these 2 methods:
    this.get = this.get.bind(this); // get() for READ request
    this.post = this.post.bind(this); // post() for CREATE, UPDATE, DELETE requests
    this.request = this.request.bind(this); // for advance usages
  }

  get axios() {
    return this._axios;
  }

  // _getDevPath (path) {
  //   // if (this._isFEDev) {
  //   //   return '/backdoor/default-api-endpoint';
  //   // } else if (this._isBEDev) {
  //   //   return '/backdoor/v1/' + path;
  //   // }
  //   // return '/backdoor/v1/' + path;
  //   return this._isFEDev ? '/backdoor/default-api-endpoint' : path;
  // }

  getCancelTokenSrc() {
    return CancelToken.source();
  }

  request(options) {
    // see options's avail props at https://github.com/axios/axios#request-config
    const cancelTokenSrc = this.getCancelTokenSrc();
    const p = this._axios.request({ ...options, cancelToken: cancelTokenSrc.token });
    p.cancel = cancelTokenSrc.cancel;
    return p;
  }

  _setupRequestConfig(config = {}, path = '') {
    const cancelTokenSrc = this.getCancelTokenSrc();
    let isUsingInternalAPI = true;
    if (!_isEmpty(path)) isUsingInternalAPI = path.indexOf('http') === -1;
    if (isUsingInternalAPI) {
      config.headers = {
        ...config.headers,
        // 'X-CSRF-TOKEN': Cookies.get('XSRF-TOKEN'),
      };
    }

    const result = { config };
    if (_isEmpty(config.cancelToken)) {
      result.config.cancelToken = cancelTokenSrc.token;
      result.cancel = cancelTokenSrc.cancel;
    }
    return result;
  }

  get(path, opts = {}) {
    const { config, cancel } = this._setupRequestConfig(opts, path);
    const p = this._axios.get(path, config);
    p.cancel = cancel;
    return p;
  }

  // _getInDevMode (path, ...args) {
  //   const formatPath = this._getDevPath(path);
  //   return this._axios.get(formatPath, ...args);
  // }

  post(path, ...args) {
    // if (this._isDev) {
    //   // JSON SERVER treats POST requests differently than GET requests
    //   return this._getInDevMode(path, ...args);
    // }
    return this._axios.post(path, ...args);
  }
}

export default new Alo();
