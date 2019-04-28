import * as ActionTypes from './actionTypes/notiListActionTypes';

export const pushNoti = data => ({
    type: ActionTypes.PUSH,
    data// {type, msg, id: Math.random()}
});

// export const removeNoti = dada => ({
//     type: ActionTypes.REMOVE,
//     data
// });
