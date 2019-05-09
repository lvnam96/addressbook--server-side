import axios from 'axios';
const devDomain = 'http://localhost';
const prodDomain = 'http://contacts.garyle.me';// how to get current domain? ex: adbk.config.domain.baseURL
const isDevBuild = process.env.NODE_ENV !== 'production';
const isDevServer = process.env.DEV;
// console.log(isDevBuild);
// console.log(isDevServer);
const domain = isDevServer || isDevBuild ? devDomain : prodDomain;// CHANGE THIS WHEN DEPLOYING APP ON HEROKU
const mockAPIPort = 2004;
const devServerPort = parseInt(process.env.PORT || 3000, 10);
const prodServerPort = parseInt(process.env.PORT || 80, 10);
const port = isDevBuild ? mockAPIPort : (isDevServer ? devServerPort : prodServerPort);// CHANGE THIS WHEN DEPLOYING APP ON HEROKU

const instance = axios.create({
    baseURL: domain + ':' + port,
    timeout: 30000,// default: 0
    // headers: {},
    // transformRequest: [() => {}],
    // transformResponse: [() => {}],
    withCredentials: false,// default
});

export const getJSONData = handledResponse => {
    return {
        isSuccess: true,// this means our request has reached the server successfully
        data: handledResponse.data// data sent back from server
    };
};

export const handleFailedRequest = err => {
    console.error('axios: handleFailedRequest', err);
    // to display request failed notification & decide whether re-send request,
    // return the status of this action, because the decision of how to response to user
    // should be placed in react
    return {
        isSuccess: false,
        errMsg: 'Request is failed! Please check your internet.',
    };
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

export const handleSuccessQueryButFailedTask = () => {

};

export const handleServerResponse = (axiosResponse) => {
    // axiosResponse.data contains json responded from our server's routers
    if (axiosResponse.data.res) {// this means our query is successfully SENT to our server & has a pre-defined json response
        return {
            ...axiosResponse,
            isSuccess: true,// this means our request has reached the server successfully
            // data: axiosResponse.data// data sent back from server
        };
    } else {// this means the task is failed, not the query
        return {
            isSuccess: false,
            errMsg: 'Sorry! Something is wrong on our server :(',
        };
    }
};

export default instance;
