import * as ActionTypes from './actionTypes/userActionTypes';
import alo, { handleServerResponse, handleFailedRequest } from '../services/httpServices';

export const replaceUser = (user) => ({
  type: ActionTypes.REPLACE,
  user,
});

export const setDefaultCbook = (cbookId) => ({
  type: ActionTypes.META_SET_DEFAULT_CBOOK,
  cbookId,
});

export const asyncSetDefaultCbook = (cbookId) => (dispatch, getState) => {
  return (
    alo
      .post('/backdoor/user/meta/set-default-cbook', { cbookId })
      .then(handleServerResponse)
      .catch(handleFailedRequest)
      .then((json) => {
        if (json.isSuccess) {
          dispatch(setDefaultCbook(cbookId));
        }
        return json;
      })
  );
};
