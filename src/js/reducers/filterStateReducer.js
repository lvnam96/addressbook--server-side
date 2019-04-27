import * as ActionTypes from '../actions/actionTypes/filterStateActionTypes';

const filterStateReducer = (state = 0, action) => {
    switch (action.type) {
        case ActionTypes.ALL:
            return 0;
        case ActionTypes.WEEK:
            return 1;
        case ActionTypes.MONTH:
            return 2;
        default:
            return state;
    }
};

export default filterStateReducer;
