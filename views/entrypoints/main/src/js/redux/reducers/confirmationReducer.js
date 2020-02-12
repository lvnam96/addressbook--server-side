import * as ActionTypes from '../actions/actionTypes/confirmationActionTypes';

const initialState = {
  isOpenDialog: false,
  callback: null
};
const cbooksReducer = (state = initialState, action) => {
  switch (action.type) {
  case ActionTypes.OPEN:
    return {
      ...state,
      isOpenDialog: true,
      content: action.content,
      callback: action.callback
    };
  case ActionTypes.CLOSE:
    return {
      ...state,
      isOpenDialog: false,
      callback: null,
    };
  default:
    return state;
  }
};

export default cbooksReducer;
