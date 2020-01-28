import alo from '../../../../../core/js/models/Alo';

const GENERAL_SERVER_ERR_MSG = "Sorry! Something's wrong on our server :(";
const FAILED_REQUEST_ERR_MSG = 'Request is failed! Please check your internet.';

export const handleFailedRequest = (err, customErrMsg) => {
  console.error('axios: handleFailedRequest', err);
  // to display request failed notification & decide whether we should re-send the request.
  // here we return the status of this action, because the decision of how to response to user
  // should be placed in react

  if (customErrMsg) {
    switch (err.status) {
    case 404:
      customErrMsg = '404 error. Please try again later.';
      break;
    case 300:
      customErrMsg = '300 error. Please try again later.';
      break;
    case 500:
      customErrMsg = '500 error. Please try again later.';
      break;
    default:
      customErrMsg = FAILED_REQUEST_ERR_MSG;
    }
  }
  return {
    isSuccess: false,
    errMsg: customErrMsg,
  };
};

export const handleSuccessQueryButFailedTask = () => {
  // tell user the request executed successfully on server but failed on client side, refresh the app to see newest updates
};

// previous version of handleServerResponse:
// export const getJSONData = (handledResponse) => {
//   return {
//     isSuccess: true, // this means our request has reached the server successfully
//     data: handledResponse.data, // data sent back from server
//   };
// };
export const handleServerResponse = (axiosResponse) => {
  // axiosResponse.data contains json responded from our server
  if (axiosResponse.data.res) {
    // this means our query is successfully SENT to our server & has a pre-defined json response
    return {
      ...axiosResponse,
      isSuccess: true, // this means our request has reached the server successfully
      // data: axiosResponse.data// data sent back from server
    };
  } else {
    // this means the task is failed, not the query
    return {
      isSuccess: false,
      errMsg: GENERAL_SERVER_ERR_MSG,
    };
  }
};

// BASIC USECASE PATTERN:

// requestToGetSomething = () => {
//   return alo
//     .get(URL)
//     .then(handleServerResponse)
//     .catch(handleFailedRequest);
//   OR:
//     .catch((err) => handleFailedRequest(err, 'custom error message'));
// }

// then consumer of requestToGetSomething will have to check for res.isSuccess first before accessing to res.data:
// requestToGetSomething().then((res) => {
//   if (res.isSuccess) {
//     // do somthing with res.data
//   } else {
//     // show notification to user with res.errMsg
//   }
// });

export default alo;
// export default axiosInstance;
