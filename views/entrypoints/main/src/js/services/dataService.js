import alo, { handleFailedRequest } from './httpServices';

export const handleThirdPartyAPIResponse = (axiosResponse) => {
  // axiosResponse.data contains json responded from our server's routers
  if (axiosResponse.data) {
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
      errMsg: 'Sorry! Something is wrong with the third-party APIs :(',
    };
  }
};

export const getCountriesList = () => {
  return alo
    .get('https://restcountries.eu/rest/v2/all')
    .then(handleThirdPartyAPIResponse)
    .catch((err) => handleFailedRequest(err, 'Countries list API request is not success!'));
};
