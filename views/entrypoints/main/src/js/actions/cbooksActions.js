import * as ActionTypes from './actionTypes/cbooksActionTypes';
import alo, { handleServerResponse, handleFailedRequest } from '../services/httpServices';
import adbk from '../controllers/adbk';

// used in adbk when first time load all data
export const replaceAllCbooks = (cbooks) => ({
  type: ActionTypes.REPLACE_ALL,
  cbooks,
});

export const addCbook = (cbook) => ({
  type: ActionTypes.ADD,
  cbook,
});

export const asyncAddCbook = (cbook) => (dispatch, getState) => {
  return alo
    .post('/backdoor/cbook/create', { cbook: cbook.toJSON() })
    .then(handleServerResponse)
    .catch(handleFailedRequest)
    .then((json) => {
      if (json.isSuccess) {
        const cbook = adbk.classes.Cbook.fromJSON(json.data.cbook);
        dispatch(addCbook(cbook));
      }
      return json;
    });
};

export const deleteCbook = (id) => ({
  type: ActionTypes.DELETE,
  id,
});

export const asyncDeleteCbook = (cbook) => (dispatch, getState) => {
  return alo
    .post('/backdoor/cbook/delete', { cbook: cbook.toJSON() })
    .then(handleServerResponse)
    .catch(handleFailedRequest)
    .then((json) => {
      if (json.isSuccess) {
        const cbook = adbk.classes.Cbook.fromJSON(json.data.cbook);
        dispatch(deleteCbook(cbook.id));
      }
      return json;
    });
};

export const editCbook = (cbook) => ({
  type: ActionTypes.EDIT,
  cbook,
});

export const asyncEditCbook = (cbook) => (dispatch, getState) => {
  return alo
    .post('/backdoor/cbook/update', { cbook: cbook.toJSON() })
    .then(handleServerResponse)
    .catch(handleFailedRequest)
    .then((json) => {
      if (json.isSuccess) {
        const cbook = adbk.classes.Cbook.fromJSON(json.data.cbook);
        dispatch(editCbook(cbook));
      }
      return json;
    });
};
