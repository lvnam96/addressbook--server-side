import * as ActionTypes from '../actions/actionTypes/contactsListActionTypes';
import { find } from '../helpers/findHelper';
import Contact from '../classes/Contact';

const initialState = [];
const contactsListReducer = (state = initialState, action) => {
    let index;

    switch (action.type) {
        case ActionTypes.ADD:
            return [...state, new Contact(action.contact)];
        case ActionTypes.EDIT:
            index = find(action.contact.id, state);
            console.log(new Contact(action.contact))
            return [
                ...state.slice(0, index),
                new Contact(action.contact),
                ...state.slice(index + 1)
            ];
            return [...state, action.data];
        case ActionTypes.MARK:
            index = find(action.contact.id, state);
            return [
                ...state.slice(0, index),
                new Contact({
                    ...action.contact,
                    isMarked: true
                }),
                ...state.slice(index + 1)
            ];
        case ActionTypes.UNMARK:
            index = find(action.contact.id, state);
            return [
                ...state.slice(0, index),
                new Contact({
                    ...action.contact,
                    isMarked: false
                }),
                ...state.slice(index + 1)
            ];
        case ActionTypes.TOGGLE_MARKER:
            index = find(action.contact.id, state);
            return [
                ...state.slice(0, index),
                new Contact({
                    ...action.contact,
                    isMarked: !action.contact.isMarked
                }),
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
