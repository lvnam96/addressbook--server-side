import * as ActionTypes from './actionTypes/confirmationActionTypes';

export const openConfirmDialog = (callback, content = {}) => {
  return {
    type: ActionTypes.OPEN,
    content,
    callback,
  };
};

export const closeConfirmDialog = () => {
  return {
    type: ActionTypes.CLOSE,
  };
};
