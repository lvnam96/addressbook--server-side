import * as ActionTypes from '../actions/actionTypes/userActionTypes';
import User from '../../models/User';

const initialState = {};
const userReducer = (state = initialState, action) => {
  let user;
  switch (action.type) {
  case ActionTypes.META_SET_DEFAULT_CBOOK:
    user = new User({
      ...state.toJSON(),
      meta: {
        ...state.meta,
        lastActivatedCbookId: action.cbookId,
      },
    });
    return user;
  case ActionTypes.REPLACE:
    user = new User(action.user);
    return user;
  default:
    return state;
  }
};

export default userReducer;
