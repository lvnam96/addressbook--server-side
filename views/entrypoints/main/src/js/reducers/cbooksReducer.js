import * as ActionTypes from '../actions/actionTypes/cbooksActionTypes';
import Cbook from '../classes/Addressbook';

const initialState = [];
const cbooksReducer = (state = initialState, action) => {
  switch (action.type) {
  case ActionTypes.REPLACE_ALL:
    return action.cbooks.map((cbook) => new Cbook(cbook));
  case ActionTypes.ADD:
    return [...state, new Cbook(action.cbook)];
  case ActionTypes.DELETE:
    return state.filter((cbook) => cbook.id !== action.id);
  case ActionTypes.EDIT:
    return state.map((cbook) => {
      if (cbook.id === action.cbook.id) {
        return new Cbook(action.cbook);
      } else {
        return cbook;
      }
    });
  default:
    return state;
  }
};

export default cbooksReducer;
