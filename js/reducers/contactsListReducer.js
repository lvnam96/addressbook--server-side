import * as ActionTypes from '../actions/actionTypes/contactsListActionTypes';
import { find } from '../helpers/findHelper';

const contactsListReducer = (state = [], action) => {
    let index;

    switch (action.type) {
        case ActionTypes.ADD:
            return [...state, action.data];
        case ActionTypes.EDIT:
            index = find(action.id, state);
            return [
                ...state.slice(0, index),
                action.data,
                ...state.slice(index + 1)
            ];
            return [...state, action.data];
        case ActionTypes.MARK:
            index = find(action.id, state);
            return [
                ...state.slice(0, index),
                {
                    ...action.data,
                    isMarked: true
                },
                ...state.slice(index + 1)
            ];
        case ActionTypes.UNMARK:
            index = find(action.id, state);
            return [
                ...state.slice(0, index),
                {
                    ...action.data,
                    isMarked: false
                },
                ...state.slice(index + 1)
            ];
        case ActionTypes.TOGGLE_MARKER:
            index = find(action.id, state);
            return [
                ...state.slice(0, index),
                {
                    ...action.data,
                    isMarked: !action.data.isMarked
                },
                ...state.slice(index + 1)
            ];
        case ActionTypes.REMOVE:
            index = find(action.id, state);
            return [
                ...state.slice(0, index),
                ...state.slice(index + 1)
            ];
        case ActionTypes.MULTI_REMOVE:
            return [...state.filter(contact => !contact.isMarked)];
        case ActionTypes.REMOVE_ALL:
            return [];
        case ActionTypes.REPLACE_ALL:
            return [...action.data];
        default:
            return state;
    }
};

export default contactsListReducer;
