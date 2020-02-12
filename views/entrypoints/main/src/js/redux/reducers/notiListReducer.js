import * as ActionTypes from '../actions/actionTypes/notiListActionTypes';

const initialState = [];
const notiListReducer = (state = initialState, action) => {
  let removedFirstItemState;
  switch (action.type) {
  case ActionTypes.PUSH:
    removedFirstItemState = state.length === 2 ? state.slice(1) : state;
    return [...removedFirstItemState, action.data];
    // case ActionTypes.REMOVE:
    //     return [];
  default:
    return state;
  }
};

export default notiListReducer;
