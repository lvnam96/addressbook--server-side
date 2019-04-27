import axios from 'axios';
const devDomain = 'http://localhost';
const prodDomain = 'http://ab.garyle.me';
const domain = process.env.NODE_ENV !== 'production' ? devDomain : devDomain;// CHANGE THIS WHEN DEPLOYING APP ON HEROKU
const mockAPIPort = 2004;
const devServerPort = 3000;
const prodServerPort = 80;
const port = process.env.NODE_ENV !== 'production' ? mockAPIPort : devServerPort;// CHANGE THIS WHEN DEPLOYING APP ON HEROKU

const instance = axios.create({
    baseURL: domain + ':' + port,
    timeout: 30000,// default: 0
    // headers: {},
    // transformRequest: [() => {}],
    // transformResponse: [() => {}],
    withCredentials: false,// default
});

export const getJSONData = res => {
    return {
        isSuccess: true,// this means our request has reached the server successfully
        data: res.data// data sent back from server
    };
};

export const handleFailedRequest = err => {
    console.log('axios: handleFailedRequest', err);
    // to display request failed notification & decide whether re-send request,
    // return the status of this action, because the decision of how to response to user
    // should be placed in react
    return { isSuccess: false };
    // switch (err.status) {
    //     case 404:
    //         err.msg = '404 error. Please try again later.';
    //         break;
    //     case 300:
    //         err.msg = '300 error. Please try again later.';
    //         break;
    //     case 500:
    //         err.msg = '500 error. Please try again later.';
    //         break;
    //     default:
    //         err.msg = 'Something wrong on our server. Please try again.';
    // }
    // err.code = res.statusCode;
};

export default instance;
