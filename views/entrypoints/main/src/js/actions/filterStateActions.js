import * as ActionTypes from './actionTypes/filterStateActionTypes';

export const changeStateToAll = () => ({ type: ActionTypes.ALL });

export const changeStateToWeek = () => ({ type: ActionTypes.WEEK });

export const changeStateToMonth = () => ({ type: ActionTypes.MONTH });
